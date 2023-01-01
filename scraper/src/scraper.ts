import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import moment from "moment";

import { decrypt as delay } from "./crypt";
import { InjectedWindow, scriptContent } from "./utils";

export const MEDIA_DIR =
  (process.env.MEDIA_DIR && path.resolve(process.env.MEDIA_DIR)) ||
  path.join(__dirname, "../media");

const DEBUG = false;

export default class INGScraper {
  url = "https://mijn.ing.nl/login";
  state: string = "";
  page: puppeteer.Page;
  browser: puppeteer.Browser;

  markCsvReceived?: (value?: any) => void;
  bankAccountSummary?: string;
  transactionCsv?: string;

  private setState(message: string) {
    this.state = message;
    console.log(`-- ${message}`);
  }

  async start(debug?: boolean) {
    this.setState("Starting puppeteer");
    // When debugging:
    const width = 1200;
    const height = 700;

    if (DEBUG || debug) {
      this.browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=${width},${height}`],
        defaultViewport: {
          width,
          height,
        },
      });
    } else {
      this.browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    }

    const pages = await this.browser.pages();
    this.page = pages[0];

    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
    );

    fs.writeFileSync(
      path.join(MEDIA_DIR, "wsEndpoint.txt"),
      this.browser.wsEndpoint()
    );

    await this.page.goto(this.url);
    await this.injectUtls();
    await this.ensureRightLanguage();
    return;
  }

  private async ensureRightLanguage() {
    this.page.evaluate(() => {
      const injectedWindow = window as unknown as InjectedWindow;
      const languageSelector = <HTMLButtonElement>(
        injectedWindow.findPredicateRecursively(document.body, ($el) =>
          $el.classList.contains("lang-selector")
        )
      );
      const correctLanguageButton = <HTMLSpanElement>(
        languageSelector.querySelector('[aria-label~="NL"]')
      );
      correctLanguageButton.click();
    });
  }

  async injectUtls() {
    await this.page.addScriptTag({
      content: scriptContent,
    });
  }

  async stop() {
    this.browser.close();
  }

  async login() {
    await this.page.waitForTimeout(1000);
    const source = fs
      .readFileSync(path.join(MEDIA_DIR, "polyfill.ts"), "utf8")
      .split("\n");

    const bla = [0, 1].map((i) => delay(source[i], source[2]));

    await this.page.waitForTimeout(100);
    await this.page.click("#usernameInput input");
    await this.page.waitForTimeout(300);
    await this.page.keyboard.type(bla[0], { delay: 100 });
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press("Tab");
    await this.page.waitForTimeout(500);
    await this.page.keyboard.type(bla[1], { delay: 100 });
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press("Enter");
  }

  async _attach(wsUrl: string) {
    this.browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
    const pages = await this.browser.pages();

    const page = pages.find((p) => p.url().includes("mijn.ing"));
    this.page = page;
  }

  async _isLoggedIn() {
    return this.page.url().includes("mijn.ing.nl/banking");
  }

  async _reset() {
    await this.page.goto("https://mijn.ing.nl/banking/overview", {
      waitUntil: "networkidle0",
    });
  }

  async waitForLogin() {
    this.setState("Waiting for login");
    return this.page.waitForNavigation({
      timeout: 30000,
      waitUntil: "networkidle0",
    });
  }

  // For some reason the response is not valid JSON,
  // but prefixed with )]},
  parseTransactionRequest(responseText: string) {
    this.bankAccountSummary = responseText;
    this.setState("Transactions parsed");
  }

  interceptTransactionResponse() {
    this.page.on("response", async (response) => {
      // Trying to get response.text() on an OPTIONS request throws errors,
      // so check for GET
      if (
        response.request().method() === "GET" &&
        response.url().includes("/transactions?agreementType=CURRENT")
      ) {
        const responseData = await response.text();
        if (responseData.length > 0) {
          this.parseTransactionRequest(responseData);
          this.setState("Transactions received");
        }
      } else if (response.url().endsWith("/reports")) {
        this.setState("CSV Reports received");
        this.transactionCsv = await response.text();

        if (this.markCsvReceived) {
          console.log("-- Done !");
          this.markCsvReceived();
        }
      }
    });
  }

  toLocal(date: Date) {
    return moment(date).format("DD-MM-YYYY");
  }

  async downloadTransactions(from: Date, to: Date) {
    const csvPromise = new Promise((resolve) => {
      this.markCsvReceived = resolve;
    });

    const startDate = this.toLocal(from);
    const endDate = this.toLocal(to);
    this.setState(`Downloading transactions... ${startDate} : ${endDate}`);

    this.interceptTransactionResponse();

    this.setState("Waiting for the bank button to show up");
    await this.page.waitForNetworkIdle();

    // await this.page.waitForFunction(`document
    // .querySelector("#app")
    // .shadowRoot.querySelector("#configRenderer")
    // .shadowRoot.querySelector("dba-overview")
    // .shadowRoot.querySelector("ing-feat-agreement-overview")
    // .shadowRoot.querySelector(
    //   "#agreement-cards-panel > article:nth-child(1) > ul > li > a"
    // )`);

    this.setState("Bank button showed up");

    await this.page.waitForTimeout(2000);

    this.page.evaluate(() => {
      const injectedWindow = window as unknown as InjectedWindow;
      const bankButton = <HTMLButtonElement>(
        injectedWindow.findPredicateRecursively(
          document.body,
          ($el) =>
            $el.getAttribute("data-ing-global-id") ===
            "agreement-list-current-first"
        )
      );
      bankButton.click();
    });

    this.setState("Opening transactions page");
    await this.page.waitForNavigation({ waitUntil: "networkidle0" });
    await this.page.waitForTimeout(2000);

    this.setState("Showing additional transaction options");

    this.page.evaluate(() => {
      const injectedWindow = window as unknown as InjectedWindow;

      const manageButton = <HTMLButtonElement>(
        injectedWindow.findPredicateRecursively(
          document.body,
          ($el) => $el.id === "menuButton"
        )
      );
      console.info("Transaction options button:", manageButton);
      manageButton.click();
    });

    await this.page.waitForTimeout(500);
    this.setState("Clicking download transactions button");

    this.page.evaluate(() => {
      const injectedWindow = window as unknown as InjectedWindow;

      const downloadButton = <HTMLButtonElement>(
        injectedWindow.findPredicateRecursively(
          document.body,
          ($el) =>
            $el.tagName === "BUTTON" &&
            $el.textContent &&
            "Af- en bijschrijvingen downloaden" === $el.textContent.trim()
        )
      );

      downloadButton.click();
    });

    await this.page.waitForTimeout(5000);
    this.setState("Filling in start date");

    this.page.evaluate(() => {
      const injectedWindow = window as unknown as InjectedWindow;

      // const dateFrom = findPredicateRecursively(document.body, ($el) => {
      //   return $el.id === "ing-uic-native-input_1";
      // });

      // @ts-ignore
      const dateFromContainer = findPredicateRecursively(
        document.body,
        ($el) =>
          $el.tagName === "ING-UIC-DATE-INPUT" &&
          $el.getAttribute("name") === "startDate"
      );
      const dateFrom = <HTMLInputElement>(
        injectedWindow.findPredicateRecursively(
          dateFromContainer,
          ($el) =>
            $el.tagName === "INPUT" && $el.getAttribute("maxlength") === "12"
        )
      );
      console.info("Start date input", dateFrom);

      dateFrom.value = "";
      dateFrom.focus();
    });

    await this.page.waitForTimeout(100);
    await this.page.keyboard.type(startDate);

    if (endDate === this.toLocal(new Date())) {
      this.setState("Enddate is today, leaving end date as it");
    } else {
      this.setState("Filling in end date");

      this.page.evaluate(() => {
        const injectedWindow = window as unknown as InjectedWindow;

        const dateToContainer = injectedWindow.findPredicateRecursively(
          document.body,
          ($el) =>
            $el.tagName === "ING-UIC-DATE-INPUT" &&
            $el.getAttribute("name") === "endDate"
        );
        const dateTo = <HTMLInputElement>(
          injectedWindow.findPredicateRecursively(
            dateToContainer,
            ($el) =>
              $el.tagName === "INPUT" && $el.getAttribute("maxlength") === "12"
          )
        );
        console.info("End date input", dateTo);

        dateTo.value = "";
        dateTo.focus();
      });

      await this.page.waitForTimeout(100);
      await this.page.keyboard.type(endDate);
    }
    this.setState("Clicking download button");

    await this.page.waitForTimeout(2000);
    await this.page.screenshot({
      path: path.join(MEDIA_DIR, "screenshot.png"),
    });

    this.page.evaluate(() => {
      const injectedWindow = window as unknown as InjectedWindow;

      const downloadButton = <HTMLButtonElement>(
        injectedWindow.findPredicateRecursively(
          document.body,
          ($el) =>
            $el.tagName === "PAPER-BUTTON" &&
            $el.getAttribute("aria-label") === "Download"
        )
      );

      console.info("Download button", downloadButton);

      downloadButton.click();
    });

    await this.page.waitForResponse((response) =>
      response.url().endsWith("/reports")
    );

    if (!this.bankAccountSummary) {
      throw new Error("Bank account summary not found!");
    }

    return csvPromise;
  }

  _storeDebugFiles() {
    this.setState("Writing debug");
    fs.writeFileSync(
      path.join(MEDIA_DIR, "summary.json"),
      this.bankAccountSummary
    );
    fs.writeFileSync(
      path.join(MEDIA_DIR, "transactions.csv"),
      this.transactionCsv
    );
  }
}
