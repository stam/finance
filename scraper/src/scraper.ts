import puppeteer from "puppeteer";
import fs from "fs";

import { decrypt as delay } from "./crypt";
import path from "path";
import moment from "moment";

export const MEDIA_DIR =
  (process.env.MEDIA_DIR && path.resolve(process.env.MEDIA_DIR)) ||
  path.join(__dirname, "../media");

const DEBUG = false;

export default class INGScraper {
  url = "https://mijn.ing.nl/login";
  state: string = "";
  page: puppeteer.Page;
  browser: puppeteer.Browser;

  markCsvReceived?: () => void;
  bankAccountSummary?: string;
  transactionCsv?: string;

  private setState(message: string) {
    this.state = message;
    console.log(`-- ${message}`);
  }

  async start() {
    this.setState("Starting puppeteer");
    // When debugging:
    const width = 1200;
    const height = 700;

    if (DEBUG) {
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
    return;
  }

  async stop() {
    this.browser.close();
  }

  async login() {
    const source = fs
      .readFileSync(path.join(MEDIA_DIR, "polyfill.ts"), "utf8")
      .split("\n");

    const bla = [0, 1].map((i) => delay(source[i], source[2]));

    await this.page.waitFor(100);
    await this.page.keyboard.type(bla[0], { delay: 100 });
    await this.page.waitFor(300);
    await this.page.keyboard.press("Tab");
    await this.page.waitFor(500);
    await this.page.keyboard.type(bla[1], { delay: 100 });
    await this.page.waitFor(500);
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
      timeout: 0,
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
      if (response.url().endsWith("/transactions?agreementType=CURRENT")) {
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

    await this.page.waitForFunction(`document
    .querySelector("#app")
    .shadowRoot.querySelector("#start-of-content > dba-overview")
    .shadowRoot.querySelector("ing-orange-agreement-overview")
    .shadowRoot.querySelector(
      "#agreement-cards-panel > article:nth-child(1) > ul > li > a"
    )`);

    this.setState("Bank button showed up");

    await this.page.waitFor(2000);

    this.page.evaluate(() => {
      const bankButton = <HTMLButtonElement>(
        document
          .querySelector("#app")
          .shadowRoot.querySelector("#start-of-content > dba-overview")
          .shadowRoot.querySelector("ing-orange-agreement-overview")
          .shadowRoot.querySelector(
            "#agreement-cards-panel > article:nth-child(1) > ul > li > a"
          )
      );
      console.info("Opening the transactions page", bankButton);
      bankButton.click();
    });

    this.setState("Openings transactions page");

    await this.page.waitForNavigation({ waitUntil: "networkidle0" });
    await this.page.waitFor(2000);
    this.setState("Showing additional transaction options");

    this.page.evaluate(() => {
      const manageButton = <HTMLButtonElement>(
        document
          .querySelector("#app")
          .shadowRoot.querySelector("#start-of-content > dba-payment-details")
          .shadowRoot.querySelector("ing-orange-agreement-details-payment")
          .shadowRoot.querySelector("#menuButton")
      );
      console.info("Transaction options button:", manageButton);
      manageButton.click();
    });

    await this.page.waitFor(500);
    this.setState("Clicking download transactions button");

    this.page.evaluate(() => {
      const modalButton = <HTMLButtonElement>(
        document
          .querySelector("#app")
          .shadowRoot.querySelector("#start-of-content > dba-payment-details")
          .shadowRoot.querySelector("ing-orange-agreement-details-payment")
          .shadowRoot.querySelector("#detailsMenu > ing-ow-desktop-menu")
          .shadowRoot.querySelector("div > div > ing-ow-menu-items")
          .shadowRoot.querySelector("ul > li:nth-child(1) > button")
      );
      console.info("Download transactions button", modalButton);

      modalButton.click();
    });

    await this.page.waitFor(2000);
    this.setState("Filling in start date");

    this.page.evaluate(() => {
      const dateFrom = <HTMLInputElement>(
        document
          .querySelector("dba-download-transactions-dialog")
          .shadowRoot.querySelector("ing-orange-transaction-download-dialog")
          .shadowRoot.querySelector("#downloadFilter")
          .shadowRoot.querySelectorAll("ing-uic-date-input")[0]
          .shadowRoot.querySelector("#viewInput")
          .shadowRoot.querySelector("input")
      );
      console.info("Start date input", dateFrom);

      dateFrom.value = "";
      dateFrom.focus();
    });

    await this.page.waitFor(100);
    await this.page.keyboard.type(startDate);

    if (endDate === this.toLocal(new Date())) {
      this.setState("Enddate is today, leaving end date as it");
    } else {
      this.setState("Filling in end date");

      this.page.evaluate(() => {
        const dateTo = <HTMLInputElement>(
          document
            .querySelector("dba-download-transactions-dialog")
            .shadowRoot.querySelector("ing-orange-transaction-download-dialog")
            .shadowRoot.querySelector("#downloadFilter")
            .shadowRoot.querySelectorAll("ing-uic-date-input")[1]
            .shadowRoot.querySelector("#viewInput")
            .shadowRoot.querySelector("input")
        );
        console.info("End date input", dateTo);

        dateTo.value = "";
        dateTo.focus();
      });

      await this.page.waitFor(100);
      await this.page.keyboard.type(endDate);
    }
    this.setState("Clicking download button");

    await this.page.waitFor(2000);
    await this.page.screenshot({
      path: path.join(MEDIA_DIR, "screenshot.png"),
    });

    this.page.evaluate(() => {
      const downloadButton = <HTMLButtonElement>(
        document
          .querySelector("dba-download-transactions-dialog")
          .shadowRoot.querySelector("ing-orange-transaction-download-dialog")
          .shadowRoot.querySelector("#downloadFilter")
          .shadowRoot.querySelector("ing-uic-form > form > paper-button")
      );

      console.info("Download button", downloadButton);

      downloadButton.click();
    });

    await this.page.waitForResponse((response) =>
      response.url().endsWith("/reports")
    );

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
