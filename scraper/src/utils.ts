function findPredicateRecursively($el, predicate) {
  const tagsToSkip = ["SCRIPT", "SVG"];

  // Breaks
  if (tagsToSkip.includes($el.tagName)) {
    return false;
  }

  // Tail case
  if (predicate($el) === true) {
    return $el;
  }

  // Compile children
  let children = [...$el.children];
  if ($el.shadowRoot) {
    children = [...$el.children, ...$el.shadowRoot.children];
  }
  if (children.length === 0) {
    return false;
  }

  // Recurse
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const match = findPredicateRecursively(child, predicate);
    if (match) {
      return match;
    }
  }

  return false;
}

export interface InjectedWindow extends Window {
  findPredicateRecursively: typeof findPredicateRecursively;
}

export const scriptContent = [findPredicateRecursively]
  .map((f) => f.toString())
  .join(" ");
