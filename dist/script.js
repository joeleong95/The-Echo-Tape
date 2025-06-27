const Qe = {
  awareOfLoop: !1,
  hasTape: !1,
  reviewedCaseFile: !1,
  trustBroken: !1,
  visitedLarkhill: !1,
  musicMuted: !1,
  sfxMuted: !1,
  musicVolume: 1,
  sfxVolume: 1
};
let M = { ...Qe }, Xe = !0;
function Fn(t, n) {
  if (!Xe)
    return { ...n };
  try {
    const o = localStorage.getItem(t);
    if (o)
      try {
        return { ...n, ...JSON.parse(o) };
      } catch (s) {
        console.error(`Failed to parse ${t}`, s);
      }
  } catch (o) {
    if (o instanceof DOMException)
      console.warn("localStorage unavailable; using in-memory data"), Xe = !1;
    else
      throw o;
  }
  return { ...n };
}
function Un(t, n) {
  if (Xe)
    try {
      localStorage.setItem(t, JSON.stringify(n));
    } catch (o) {
      if (o instanceof DOMException)
        console.warn(`Unable to save ${t} to localStorage`), Xe = !1;
      else
        throw o;
    }
}
function Co() {
  M = Fn("echoTapeState", Qe);
}
function Ct() {
  Un("echoTapeState", M);
}
function fe(t, n) {
  M[t] = n, Ct();
}
function ne(t) {
  return M[t];
}
function Hn() {
  M = { ...Qe }, Ct();
}
function Do() {
  const t = document.getElementById("state-summary");
  if (t) {
    const n = M.awareOfLoop ? "You know the loop is real." : "You remain unaware of the loop.", o = M.hasTape ? "The tape is in your possession." : "The tape is nowhere to be found.", s = M.reviewedCaseFile ? "You studied the case file." : "You have yet to read the case file.", l = M.trustBroken ? "Distrust festers between you." : "Trust remains intact.", c = M.visitedLarkhill ? "Larkhill Lane has been explored." : "Larkhill Lane is still a mystery.";
    t.textContent = [n, o, s, l, c].join(" ");
  }
}
const zn = "echoTapeProgress";
let j = { episode: null, scene: null };
function ko() {
  j = Fn(zn, { episode: null, scene: null });
}
function Dt() {
  Un(zn, j);
}
function No(t, n) {
  j.episode = t, j.scene = n, Dt();
}
function Gn() {
  j = { episode: null, scene: null }, Dt();
}
function Ke() {
  return j;
}
function Bo() {
  return {
    state: { ...M },
    progress: { ...j }
  };
}
function Po(t) {
  !t || typeof t != "object" || (t.state && typeof t.state == "object" && (M = { ...Qe, ...t.state }, Ct()), t.progress && typeof t.progress == "object" && (j = { episode: null, scene: null, ...t.progress }, Dt()));
}
const Z = document.getElementById("sfx-click"), B = document.getElementById("sfx-static"), me = document.getElementById("tape-fx"), R = document.getElementById("title-music"), O = document.getElementById("title-music2"), x = document.getElementById("intro-music");
B && (B.loop = !0);
R && (R.loop = !0);
O && (O.loop = !0);
x && (x.loop = !0);
let ze, C = !1, V = !1, P = 1, Y = 1;
function fn() {
  ze || (ze = new (window.AudioContext || window.webkitAudioContext)()), ze.state === "suspended" && ze.resume().catch(() => {
  });
}
function Re(t, n, o, s = !1) {
  if (!(!t || o) && (!s || t.paused)) {
    t.volume = n, t.currentTime = 0;
    const l = t.play();
    l && typeof l.catch == "function" && l.catch(() => {
      document.addEventListener("click", () => t.play(), { once: !0 });
    });
  }
}
function Fo() {
  Re(B, Y, V, !0);
}
function Uo() {
  Re(B, Y, V, !0);
}
function Ho() {
  Z && !V && (Z.volume = Y, Z.currentTime = 0, Z.play());
}
function Wn() {
  me && !V && (me.volume = Y, me.currentTime = 0, me.play());
}
function kt() {
  B && !B.paused && (B.pause(), B.currentTime = 0);
}
function Nt(t, n, o = 1) {
  if (!t) return;
  const s = performance.now();
  t.volume = 0;
  function l(c) {
    const f = Math.min((c - s) / n, 1);
    let d;
    f < 0.5 ? d = f * 1.2 : d = 0.6 + (f - 0.5) * 0.8, t.volume = Math.min(d, 1) * o, f < 1 && requestAnimationFrame(l);
  }
  requestAnimationFrame(l);
}
function Je() {
  Re(R, P, C), R && !C && Nt(R, 3e3, P);
}
function Ve() {
  R && !R.paused && (R.pause(), R.currentTime = 0);
}
function Yn() {
  Re(O, P, C), O && !C && Nt(O, 3e3, P);
}
function et() {
  O && !O.paused && (O.pause(), O.currentTime = 0);
}
function zo() {
  Re(x, P, C), x && !C && Nt(x, 1e3, P);
}
function Vn() {
  x && !x.paused && (x.pause(), x.currentTime = 0);
}
function Oe() {
  const t = document.getElementById("mute-music-btn"), n = document.getElementById("mute-sfx-btn"), o = document.getElementById("music-volume"), s = document.getElementById("sfx-volume");
  t && (t.textContent = C ? "Unmute Music" : "Mute Music"), n && (n.textContent = V ? "Unmute SFX" : "Mute SFX"), o && (o.value = P), s && (s.value = Y), R && (R.muted = C, R.volume = P), O && (O.muted = C, O.volume = P), x && (x.muted = C, x.volume = P), B && (B.muted = V, B.volume = Y), Z && (Z.muted = V, Z.volume = Y), me && (me.volume = Y);
}
function qn(t) {
  C = t, Oe();
}
function jn(t) {
  V = t, Oe();
}
function $n(t) {
  P = t, Oe();
}
function Xn(t) {
  Y = t, Oe();
}
function Go() {
  return C;
}
function Wo() {
  return V;
}
let qe = null;
function Yo(t) {
  const n = t.querySelectorAll(".case-tab-button"), o = t.querySelectorAll(".case-tab-content");
  n.forEach((s) => {
    s.addEventListener("click", () => {
      n.forEach((c) => c.classList.remove("active")), o.forEach((c) => c.style.display = "none"), s.classList.add("active");
      const l = t.querySelector(s.dataset.target);
      l && (l.style.display = "block");
    });
  }), n[0] && n[0].click();
}
function Vo(t) {
  t.querySelectorAll(".case-play-audio").forEach((o) => {
    o.addEventListener("click", () => {
      Wn();
      const s = o.nextElementSibling;
      s && s.classList.contains("case-audio-transcript") && (s.style.display = "block");
    });
  });
}
function qo(t) {
  const n = t.querySelector(".case-vhs"), o = t.querySelector(".case-vhs-status");
  !n || !o || (n.addEventListener("mouseenter", () => {
    o.textContent = ">> ENERGY SIGNATURE DETECTED...", o.classList.add("alert");
  }), n.addEventListener("mouseleave", () => {
    o.textContent = ">> Artifact is dormant. Hover to detect energy signature.", o.classList.remove("alert");
  }));
}
function jo(t) {
  const n = t.querySelector(".case-header");
  if (!n) return;
  const o = n.textContent, s = "!<>-_/[]{}—=+*^?#________";
  qe = setInterval(() => {
    let l = "";
    for (let c = 0; c < o.length; c++)
      l += Math.random() > 0.85 ? s[Math.floor(Math.random() * s.length)] : o[c];
    n.textContent = l;
  }, 100);
}
function Kn() {
  qe && (clearInterval(qe), qe = null);
}
function Jn(t) {
  !t || t.dataset.caseFileInit || (t.dataset.caseFileInit = "true", Yo(t), Vo(t), qo(t), jo(t));
}
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: Zn,
  setPrototypeOf: dn,
  isFrozen: $o,
  getPrototypeOf: Xo,
  getOwnPropertyDescriptor: Ko
} = Object;
let {
  freeze: L,
  seal: D,
  create: Qn
} = Object, {
  apply: wt,
  construct: Mt
} = typeof Reflect < "u" && Reflect;
L || (L = function(n) {
  return n;
});
D || (D = function(n) {
  return n;
});
wt || (wt = function(n, o, s) {
  return n.apply(o, s);
});
Mt || (Mt = function(n, o) {
  return new n(...o);
});
const Ge = I(Array.prototype.forEach), Jo = I(Array.prototype.lastIndexOf), mn = I(Array.prototype.pop), _e = I(Array.prototype.push), Zo = I(Array.prototype.splice), je = I(String.prototype.toLowerCase), St = I(String.prototype.toString), pn = I(String.prototype.match), Ae = I(String.prototype.replace), Qo = I(String.prototype.indexOf), ei = I(String.prototype.trim), N = I(Object.prototype.hasOwnProperty), v = I(RegExp.prototype.test), be = ti(TypeError);
function I(t) {
  return function(n) {
    n instanceof RegExp && (n.lastIndex = 0);
    for (var o = arguments.length, s = new Array(o > 1 ? o - 1 : 0), l = 1; l < o; l++)
      s[l - 1] = arguments[l];
    return wt(t, n, s);
  };
}
function ti(t) {
  return function() {
    for (var n = arguments.length, o = new Array(n), s = 0; s < n; s++)
      o[s] = arguments[s];
    return Mt(t, o);
  };
}
function u(t, n) {
  let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : je;
  dn && dn(t, null);
  let s = n.length;
  for (; s--; ) {
    let l = n[s];
    if (typeof l == "string") {
      const c = o(l);
      c !== l && ($o(n) || (n[s] = c), l = c);
    }
    t[l] = !0;
  }
  return t;
}
function ni(t) {
  for (let n = 0; n < t.length; n++)
    N(t, n) || (t[n] = null);
  return t;
}
function W(t) {
  const n = Qn(null);
  for (const [o, s] of Zn(t))
    N(t, o) && (Array.isArray(s) ? n[o] = ni(s) : s && typeof s == "object" && s.constructor === Object ? n[o] = W(s) : n[o] = s);
  return n;
}
function ve(t, n) {
  for (; t !== null; ) {
    const s = Ko(t, n);
    if (s) {
      if (s.get)
        return I(s.get);
      if (typeof s.value == "function")
        return I(s.value);
    }
    t = Xo(t);
  }
  function o() {
    return null;
  }
  return o;
}
const En = L(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), _t = L(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), At = L(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), oi = L(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), bt = L(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), ii = L(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), hn = L(["#text"]), gn = L(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), vt = L(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), yn = L(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), We = L(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), si = D(/\{\{[\w\W]*|[\w\W]*\}\}/gm), ai = D(/<%[\w\W]*|[\w\W]*%>/gm), ri = D(/\$\{[\w\W]*/gm), ci = D(/^data-[\-\w.\u00B7-\uFFFF]+$/), li = D(/^aria-[\-\w]+$/), eo = D(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), ui = D(/^(?:\w+script|data):/i), fi = D(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), to = D(/^html$/i), di = D(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Tn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: li,
  ATTR_WHITESPACE: fi,
  CUSTOM_ELEMENT: di,
  DATA_ATTR: ci,
  DOCTYPE_NAME: to,
  ERB_EXPR: ai,
  IS_ALLOWED_URI: eo,
  IS_SCRIPT_OR_DATA: ui,
  MUSTACHE_EXPR: si,
  TMPLIT_EXPR: ri
});
const Le = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, mi = function() {
  return typeof window > "u" ? null : window;
}, pi = function(n, o) {
  if (typeof n != "object" || typeof n.createPolicy != "function")
    return null;
  let s = null;
  const l = "data-tt-policy-suffix";
  o && o.hasAttribute(l) && (s = o.getAttribute(l));
  const c = "dompurify" + (s ? "#" + s : "");
  try {
    return n.createPolicy(c, {
      createHTML(f) {
        return f;
      },
      createScriptURL(f) {
        return f;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + c + " could not be created."), null;
  }
}, Sn = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function no() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : mi();
  const n = (r) => no(r);
  if (n.version = "3.2.6", n.removed = [], !t || !t.document || t.document.nodeType !== Le.document || !t.Element)
    return n.isSupported = !1, n;
  let {
    document: o
  } = t;
  const s = o, l = s.currentScript, {
    DocumentFragment: c,
    HTMLTemplateElement: f,
    Node: d,
    Element: p,
    NodeFilter: k,
    NamedNodeMap: $ = t.NamedNodeMap || t.MozNamedAttrMap,
    HTMLFormElement: oe,
    DOMParser: Ce,
    trustedTypes: X
  } = t, Ee = p.prototype, fo = ve(Ee, "cloneNode"), mo = ve(Ee, "remove"), po = ve(Ee, "nextSibling"), Eo = ve(Ee, "childNodes"), De = ve(Ee, "parentNode");
  if (typeof f == "function") {
    const r = o.createElement("template");
    r.content && r.content.ownerDocument && (o = r.content.ownerDocument);
  }
  let A, he = "";
  const {
    implementation: st,
    createNodeIterator: ho,
    createDocumentFragment: go,
    getElementsByTagName: yo
  } = o, {
    importNode: To
  } = s;
  let b = Sn();
  n.isSupported = typeof Zn == "function" && typeof De == "function" && st && st.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: at,
    ERB_EXPR: rt,
    TMPLIT_EXPR: ct,
    DATA_ATTR: So,
    ARIA_ATTR: _o,
    IS_SCRIPT_OR_DATA: Ao,
    ATTR_WHITESPACE: Ut,
    CUSTOM_ELEMENT: bo
  } = Tn;
  let {
    IS_ALLOWED_URI: Ht
  } = Tn, g = null;
  const zt = u({}, [...En, ..._t, ...At, ...bt, ...hn]);
  let T = null;
  const Gt = u({}, [...gn, ...vt, ...yn, ...We]);
  let E = Object.seal(Qn(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), ge = null, lt = null, Wt = !0, ut = !0, Yt = !1, Vt = !0, ie = !1, ke = !0, K = !1, ft = !1, dt = !1, se = !1, Ne = !1, Be = !1, qt = !0, jt = !1;
  const vo = "user-content-";
  let mt = !0, ye = !1, ae = {}, re = null;
  const $t = u({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Xt = null;
  const Kt = u({}, ["audio", "video", "img", "source", "image", "track"]);
  let pt = null;
  const Jt = u({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Pe = "http://www.w3.org/1998/Math/MathML", Fe = "http://www.w3.org/2000/svg", H = "http://www.w3.org/1999/xhtml";
  let ce = H, Et = !1, ht = null;
  const Lo = u({}, [Pe, Fe, H], St);
  let Ue = u({}, ["mi", "mo", "mn", "ms", "mtext"]), He = u({}, ["annotation-xml"]);
  const Io = u({}, ["title", "style", "font", "a", "script"]);
  let Te = null;
  const wo = ["application/xhtml+xml", "text/html"], Mo = "text/html";
  let y = null, le = null;
  const Ro = o.createElement("form"), Zt = function(e) {
    return e instanceof RegExp || e instanceof Function;
  }, gt = function() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(le && le === e)) {
      if ((!e || typeof e != "object") && (e = {}), e = W(e), Te = // eslint-disable-next-line unicorn/prefer-includes
      wo.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? Mo : e.PARSER_MEDIA_TYPE, y = Te === "application/xhtml+xml" ? St : je, g = N(e, "ALLOWED_TAGS") ? u({}, e.ALLOWED_TAGS, y) : zt, T = N(e, "ALLOWED_ATTR") ? u({}, e.ALLOWED_ATTR, y) : Gt, ht = N(e, "ALLOWED_NAMESPACES") ? u({}, e.ALLOWED_NAMESPACES, St) : Lo, pt = N(e, "ADD_URI_SAFE_ATTR") ? u(W(Jt), e.ADD_URI_SAFE_ATTR, y) : Jt, Xt = N(e, "ADD_DATA_URI_TAGS") ? u(W(Kt), e.ADD_DATA_URI_TAGS, y) : Kt, re = N(e, "FORBID_CONTENTS") ? u({}, e.FORBID_CONTENTS, y) : $t, ge = N(e, "FORBID_TAGS") ? u({}, e.FORBID_TAGS, y) : W({}), lt = N(e, "FORBID_ATTR") ? u({}, e.FORBID_ATTR, y) : W({}), ae = N(e, "USE_PROFILES") ? e.USE_PROFILES : !1, Wt = e.ALLOW_ARIA_ATTR !== !1, ut = e.ALLOW_DATA_ATTR !== !1, Yt = e.ALLOW_UNKNOWN_PROTOCOLS || !1, Vt = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ie = e.SAFE_FOR_TEMPLATES || !1, ke = e.SAFE_FOR_XML !== !1, K = e.WHOLE_DOCUMENT || !1, se = e.RETURN_DOM || !1, Ne = e.RETURN_DOM_FRAGMENT || !1, Be = e.RETURN_TRUSTED_TYPE || !1, dt = e.FORCE_BODY || !1, qt = e.SANITIZE_DOM !== !1, jt = e.SANITIZE_NAMED_PROPS || !1, mt = e.KEEP_CONTENT !== !1, ye = e.IN_PLACE || !1, Ht = e.ALLOWED_URI_REGEXP || eo, ce = e.NAMESPACE || H, Ue = e.MATHML_TEXT_INTEGRATION_POINTS || Ue, He = e.HTML_INTEGRATION_POINTS || He, E = e.CUSTOM_ELEMENT_HANDLING || {}, e.CUSTOM_ELEMENT_HANDLING && Zt(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (E.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck), e.CUSTOM_ELEMENT_HANDLING && Zt(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (E.attributeNameCheck = e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), e.CUSTOM_ELEMENT_HANDLING && typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (E.allowCustomizedBuiltInElements = e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), ie && (ut = !1), Ne && (se = !0), ae && (g = u({}, hn), T = [], ae.html === !0 && (u(g, En), u(T, gn)), ae.svg === !0 && (u(g, _t), u(T, vt), u(T, We)), ae.svgFilters === !0 && (u(g, At), u(T, vt), u(T, We)), ae.mathMl === !0 && (u(g, bt), u(T, yn), u(T, We))), e.ADD_TAGS && (g === zt && (g = W(g)), u(g, e.ADD_TAGS, y)), e.ADD_ATTR && (T === Gt && (T = W(T)), u(T, e.ADD_ATTR, y)), e.ADD_URI_SAFE_ATTR && u(pt, e.ADD_URI_SAFE_ATTR, y), e.FORBID_CONTENTS && (re === $t && (re = W(re)), u(re, e.FORBID_CONTENTS, y)), mt && (g["#text"] = !0), K && u(g, ["html", "head", "body"]), g.table && (u(g, ["tbody"]), delete ge.tbody), e.TRUSTED_TYPES_POLICY) {
        if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw be('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw be('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        A = e.TRUSTED_TYPES_POLICY, he = A.createHTML("");
      } else
        A === void 0 && (A = pi(X, l)), A !== null && typeof he == "string" && (he = A.createHTML(""));
      L && L(e), le = e;
    }
  }, Qt = u({}, [..._t, ...At, ...oi]), en = u({}, [...bt, ...ii]), Oo = function(e) {
    let i = De(e);
    (!i || !i.tagName) && (i = {
      namespaceURI: ce,
      tagName: "template"
    });
    const a = je(e.tagName), m = je(i.tagName);
    return ht[e.namespaceURI] ? e.namespaceURI === Fe ? i.namespaceURI === H ? a === "svg" : i.namespaceURI === Pe ? a === "svg" && (m === "annotation-xml" || Ue[m]) : !!Qt[a] : e.namespaceURI === Pe ? i.namespaceURI === H ? a === "math" : i.namespaceURI === Fe ? a === "math" && He[m] : !!en[a] : e.namespaceURI === H ? i.namespaceURI === Fe && !He[m] || i.namespaceURI === Pe && !Ue[m] ? !1 : !en[a] && (Io[a] || !Qt[a]) : !!(Te === "application/xhtml+xml" && ht[e.namespaceURI]) : !1;
  }, F = function(e) {
    _e(n.removed, {
      element: e
    });
    try {
      De(e).removeChild(e);
    } catch {
      mo(e);
    }
  }, ue = function(e, i) {
    try {
      _e(n.removed, {
        attribute: i.getAttributeNode(e),
        from: i
      });
    } catch {
      _e(n.removed, {
        attribute: null,
        from: i
      });
    }
    if (i.removeAttribute(e), e === "is")
      if (se || Ne)
        try {
          F(i);
        } catch {
        }
      else
        try {
          i.setAttribute(e, "");
        } catch {
        }
  }, tn = function(e) {
    let i = null, a = null;
    if (dt)
      e = "<remove></remove>" + e;
    else {
      const h = pn(e, /^[\r\n\t ]+/);
      a = h && h[0];
    }
    Te === "application/xhtml+xml" && ce === H && (e = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + e + "</body></html>");
    const m = A ? A.createHTML(e) : e;
    if (ce === H)
      try {
        i = new Ce().parseFromString(m, Te);
      } catch {
      }
    if (!i || !i.documentElement) {
      i = st.createDocument(ce, "template", null);
      try {
        i.documentElement.innerHTML = Et ? he : m;
      } catch {
      }
    }
    const S = i.body || i.documentElement;
    return e && a && S.insertBefore(o.createTextNode(a), S.childNodes[0] || null), ce === H ? yo.call(i, K ? "html" : "body")[0] : K ? i.documentElement : S;
  }, nn = function(e) {
    return ho.call(
      e.ownerDocument || e,
      e,
      // eslint-disable-next-line no-bitwise
      k.SHOW_ELEMENT | k.SHOW_COMMENT | k.SHOW_TEXT | k.SHOW_PROCESSING_INSTRUCTION | k.SHOW_CDATA_SECTION,
      null
    );
  }, yt = function(e) {
    return e instanceof oe && (typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || !(e.attributes instanceof $) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function");
  }, on = function(e) {
    return typeof d == "function" && e instanceof d;
  };
  function z(r, e, i) {
    Ge(r, (a) => {
      a.call(n, e, i, le);
    });
  }
  const sn = function(e) {
    let i = null;
    if (z(b.beforeSanitizeElements, e, null), yt(e))
      return F(e), !0;
    const a = y(e.nodeName);
    if (z(b.uponSanitizeElement, e, {
      tagName: a,
      allowedTags: g
    }), ke && e.hasChildNodes() && !on(e.firstElementChild) && v(/<[/\w!]/g, e.innerHTML) && v(/<[/\w!]/g, e.textContent) || e.nodeType === Le.progressingInstruction || ke && e.nodeType === Le.comment && v(/<[/\w]/g, e.data))
      return F(e), !0;
    if (!g[a] || ge[a]) {
      if (!ge[a] && rn(a) && (E.tagNameCheck instanceof RegExp && v(E.tagNameCheck, a) || E.tagNameCheck instanceof Function && E.tagNameCheck(a)))
        return !1;
      if (mt && !re[a]) {
        const m = De(e) || e.parentNode, S = Eo(e) || e.childNodes;
        if (S && m) {
          const h = S.length;
          for (let w = h - 1; w >= 0; --w) {
            const G = fo(S[w], !0);
            G.__removalCount = (e.__removalCount || 0) + 1, m.insertBefore(G, po(e));
          }
        }
      }
      return F(e), !0;
    }
    return e instanceof p && !Oo(e) || (a === "noscript" || a === "noembed" || a === "noframes") && v(/<\/no(script|embed|frames)/i, e.innerHTML) ? (F(e), !0) : (ie && e.nodeType === Le.text && (i = e.textContent, Ge([at, rt, ct], (m) => {
      i = Ae(i, m, " ");
    }), e.textContent !== i && (_e(n.removed, {
      element: e.cloneNode()
    }), e.textContent = i)), z(b.afterSanitizeElements, e, null), !1);
  }, an = function(e, i, a) {
    if (qt && (i === "id" || i === "name") && (a in o || a in Ro))
      return !1;
    if (!(ut && !lt[i] && v(So, i))) {
      if (!(Wt && v(_o, i))) {
        if (!T[i] || lt[i]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(rn(e) && (E.tagNameCheck instanceof RegExp && v(E.tagNameCheck, e) || E.tagNameCheck instanceof Function && E.tagNameCheck(e)) && (E.attributeNameCheck instanceof RegExp && v(E.attributeNameCheck, i) || E.attributeNameCheck instanceof Function && E.attributeNameCheck(i)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            i === "is" && E.allowCustomizedBuiltInElements && (E.tagNameCheck instanceof RegExp && v(E.tagNameCheck, a) || E.tagNameCheck instanceof Function && E.tagNameCheck(a)))
          ) return !1;
        } else if (!pt[i]) {
          if (!v(Ht, Ae(a, Ut, ""))) {
            if (!((i === "src" || i === "xlink:href" || i === "href") && e !== "script" && Qo(a, "data:") === 0 && Xt[e])) {
              if (!(Yt && !v(Ao, Ae(a, Ut, "")))) {
                if (a)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, rn = function(e) {
    return e !== "annotation-xml" && pn(e, bo);
  }, cn = function(e) {
    z(b.beforeSanitizeAttributes, e, null);
    const {
      attributes: i
    } = e;
    if (!i || yt(e))
      return;
    const a = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: T,
      forceKeepAttr: void 0
    };
    let m = i.length;
    for (; m--; ) {
      const S = i[m], {
        name: h,
        namespaceURI: w,
        value: G
      } = S, Se = y(h), Tt = G;
      let _ = h === "value" ? Tt : ei(Tt);
      if (a.attrName = Se, a.attrValue = _, a.keepAttr = !0, a.forceKeepAttr = void 0, z(b.uponSanitizeAttribute, e, a), _ = a.attrValue, jt && (Se === "id" || Se === "name") && (ue(h, e), _ = vo + _), ke && v(/((--!?|])>)|<\/(style|title)/i, _)) {
        ue(h, e);
        continue;
      }
      if (a.forceKeepAttr)
        continue;
      if (!a.keepAttr) {
        ue(h, e);
        continue;
      }
      if (!Vt && v(/\/>/i, _)) {
        ue(h, e);
        continue;
      }
      ie && Ge([at, rt, ct], (un) => {
        _ = Ae(_, un, " ");
      });
      const ln = y(e.nodeName);
      if (!an(ln, Se, _)) {
        ue(h, e);
        continue;
      }
      if (A && typeof X == "object" && typeof X.getAttributeType == "function" && !w)
        switch (X.getAttributeType(ln, Se)) {
          case "TrustedHTML": {
            _ = A.createHTML(_);
            break;
          }
          case "TrustedScriptURL": {
            _ = A.createScriptURL(_);
            break;
          }
        }
      if (_ !== Tt)
        try {
          w ? e.setAttributeNS(w, h, _) : e.setAttribute(h, _), yt(e) ? F(e) : mn(n.removed);
        } catch {
          ue(h, e);
        }
    }
    z(b.afterSanitizeAttributes, e, null);
  }, xo = function r(e) {
    let i = null;
    const a = nn(e);
    for (z(b.beforeSanitizeShadowDOM, e, null); i = a.nextNode(); )
      z(b.uponSanitizeShadowNode, i, null), sn(i), cn(i), i.content instanceof c && r(i.content);
    z(b.afterSanitizeShadowDOM, e, null);
  };
  return n.sanitize = function(r) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, m = null, S = null;
    if (Et = !r, Et && (r = "<!-->"), typeof r != "string" && !on(r))
      if (typeof r.toString == "function") {
        if (r = r.toString(), typeof r != "string")
          throw be("dirty is not a string, aborting");
      } else
        throw be("toString is not a function");
    if (!n.isSupported)
      return r;
    if (ft || gt(e), n.removed = [], typeof r == "string" && (ye = !1), ye) {
      if (r.nodeName) {
        const G = y(r.nodeName);
        if (!g[G] || ge[G])
          throw be("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (r instanceof d)
      i = tn("<!---->"), a = i.ownerDocument.importNode(r, !0), a.nodeType === Le.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a);
    else {
      if (!se && !ie && !K && // eslint-disable-next-line unicorn/prefer-includes
      r.indexOf("<") === -1)
        return A && Be ? A.createHTML(r) : r;
      if (i = tn(r), !i)
        return se ? null : Be ? he : "";
    }
    i && dt && F(i.firstChild);
    const h = nn(ye ? r : i);
    for (; m = h.nextNode(); )
      sn(m), cn(m), m.content instanceof c && xo(m.content);
    if (ye)
      return r;
    if (se) {
      if (Ne)
        for (S = go.call(i.ownerDocument); i.firstChild; )
          S.appendChild(i.firstChild);
      else
        S = i;
      return (T.shadowroot || T.shadowrootmode) && (S = To.call(s, S, !0)), S;
    }
    let w = K ? i.outerHTML : i.innerHTML;
    return K && g["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && v(to, i.ownerDocument.doctype.name) && (w = "<!DOCTYPE " + i.ownerDocument.doctype.name + `>
` + w), ie && Ge([at, rt, ct], (G) => {
      w = Ae(w, G, " ");
    }), A && Be ? A.createHTML(w) : w;
  }, n.setConfig = function() {
    let r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    gt(r), ft = !0;
  }, n.clearConfig = function() {
    le = null, ft = !1;
  }, n.isValidAttribute = function(r, e, i) {
    le || gt({});
    const a = y(r), m = y(e);
    return an(a, m, i);
  }, n.addHook = function(r, e) {
    typeof e == "function" && _e(b[r], e);
  }, n.removeHook = function(r, e) {
    if (e !== void 0) {
      const i = Jo(b[r], e);
      return i === -1 ? void 0 : Zo(b[r], i, 1)[0];
    }
    return mn(b[r]);
  }, n.removeHooks = function(r) {
    b[r] = [];
  }, n.removeAllHooks = function() {
    b = Sn();
  }, n;
}
var Ei = no();
const hi = typeof window < "u" && window.DOMPurify ? window.DOMPurify : Ei, J = document.getElementById("back-btn"), _n = document.getElementById("history-btn"), q = document.getElementById("history-overlay"), gi = document.getElementById("history-list"), An = document.getElementById("close-history-btn"), bn = document.getElementById("case-file-btn"), Q = document.getElementById("case-file-overlay"), vn = document.getElementById("close-case-file-btn"), Ln = document.getElementById("scene-announcer");
let pe = [], oo = null, tt = null;
function io(t) {
  oo = t;
}
function yi(t) {
  tt = t;
}
function nt() {
  pe = [];
}
function Ti(t) {
  t.style.display = "block", requestAnimationFrame(() => t.classList.add("visible"));
}
function Si(t) {
  return new Promise((n) => {
    t.classList.remove("visible"), t.addEventListener("transitionend", function o() {
      t.style.display = "none", t.removeEventListener("transitionend", o), n();
    }, { once: !0 });
  });
}
async function Bt(t, n) {
  const o = document.getElementById("vhs-screen");
  if (!o) return;
  let s;
  try {
    const d = await fetch(`episodes/episode${t}.json`);
    if (!d.ok) throw new Error(`HTTP ${d.status}`);
    s = await d.json();
  } catch (d) {
    if (console.warn("Fetch failed, trying embedded episode data", d), window.localEpisodes && window.localEpisodes[`episode${t}`])
      s = window.localEpisodes[`episode${t}`];
    else {
      console.error("Episode data not found"), o.innerHTML = '<div class="dialogue">Failed to load episode. Please check your connection and try again.</div><button id="retry-load-btn" class="choice-btn">Retry</button>';
      const p = document.getElementById("retry-load-btn");
      p && p.addEventListener("click", () => Bt(t, n));
      return;
    }
  }
  o.innerHTML = "";
  const l = [];
  s.scenes.forEach((d) => {
    if (d.showIf) {
      let k = !0;
      for (const $ in d.showIf)
        if (ne($) !== d.showIf[$]) {
          k = !1;
          break;
        }
      if (!k) return;
    }
    const p = document.createElement("div");
    p.id = d.id, p.className = "interactive-scene", p.setAttribute("role", "dialog"), p.setAttribute("aria-label", d.id), p.innerHTML = hi.sanitize(d.html || ""), p.querySelectorAll("[data-show-if]").forEach((k) => {
      const $ = k.getAttribute("data-show-if");
      if ($)
        try {
          const oe = JSON.parse($);
          let Ce = !0;
          for (const X in oe)
            if (ne(X) !== oe[X]) {
              Ce = !1;
              break;
            }
          Ce || k.remove();
        } catch (oe) {
          console.error("Invalid data-show-if", oe);
        }
    }), o.appendChild(p), l.push(d.id);
  }), nt(), yi(s.start && l.includes(s.start) ? s.start : l[0]);
  let c = tt;
  n && l.includes(n) && (c = n);
  const f = Ke();
  f.episode === t && f.scene && l.includes(f.scene) && (c = f.scene), c && await ot(c);
}
async function ot(t, n = !1) {
  const o = document.getElementById(t);
  if (!o) return;
  const s = document.querySelector(".interactive-scene.visible");
  s && s !== o && (n || pe.push(s.id), s.id === "scene-case-file" && Kn(), await Si(s)), Ti(o), t === "scene-case-file" && Jn(o), Ai(o), Uo(), xe(), o.scrollIntoView({ behavior: "smooth" }), _i(o), No(oo, t), t === "scene-tobecontinued" && Do();
}
function xe() {
  if (!J) return;
  const t = document.querySelector(".interactive-scene.visible");
  t && t.id === tt ? (J.disabled = !1, J.textContent = "Home", J.setAttribute("aria-label", "Return to title")) : (J.textContent = "← Back", J.setAttribute("aria-label", "Go back"), J.disabled = pe.length === 0);
}
function Me() {
  const t = document.getElementById("continue-btn");
  if (t) {
    const n = Ke();
    t.style.display = n.episode ? "block" : "none";
  }
}
function so() {
  if (pe.length === 0) return;
  const t = pe.pop();
  ot(t, !0);
}
function ao(t) {
  const n = document.querySelector(".interactive-scene.visible");
  n && n.id === tt ? t() : so();
}
function ro() {
  q && (gi.textContent = pe.join(" → "), q.classList.add("visible"), q.setAttribute("aria-hidden", "false"), An && An.focus());
}
function Rt() {
  q && (q.classList.remove("visible"), q.setAttribute("aria-hidden", "true"), _n && _n.focus());
}
function co() {
  Q && (Jn(Q), Q.classList.add("visible"), Q.setAttribute("aria-hidden", "false"), vn && vn.focus());
}
function Ot() {
  Q && (Kn(), Q.classList.remove("visible"), Q.setAttribute("aria-hidden", "true"), bn && bn.focus());
}
function _i(t) {
  const n = t.querySelector(".choice-btn");
  n && n.focus();
}
function Ai(t) {
  Ln && (Ln.textContent = t.innerText || t.textContent || "");
}
function lo(t) {
  if (q && q.classList.contains("visible")) return;
  const n = document.querySelector(".interactive-scene.visible");
  if (!n) return;
  const o = Array.from(n.querySelectorAll(".choice-btn"));
  if (o.length === 0) return;
  let s = o.indexOf(document.activeElement);
  if (t.key === "ArrowDown" || t.key === "ArrowRight")
    s = (s + 1) % o.length, o[s].focus(), t.preventDefault();
  else if (t.key === "ArrowUp" || t.key === "ArrowLeft")
    s = (s - 1 + o.length) % o.length, o[s].focus(), t.preventDefault();
  else if (/^[1-9]$/.test(t.key)) {
    const l = parseInt(t.key, 10) - 1;
    l >= 0 && l < o.length && (o[l].focus(), o[l].click());
  }
}
const bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearHistory: nt,
  closeCaseFile: Ot,
  closeHistory: Rt,
  goBack: so,
  goToScene: ot,
  handleBackBtn: ao,
  handleKeydown: lo,
  loadEpisode: Bt,
  setCurrentEpisode: io,
  showCaseFile: co,
  showHistory: ro,
  updateBackButton: xe,
  updateContinueButton: Me
}, Symbol.toStringTag, { value: "Module" })), de = document.getElementById("title-screen"), we = document.getElementById("episode-screen"), it = document.getElementById("intro-screen"), Ye = document.querySelector(".intro-text"), In = document.getElementById("intro-title"), wn = document.getElementById("skip-intro-btn"), Pt = document.querySelector(".container"), vi = document.getElementById("start-btn"), Mn = document.getElementById("continue-btn"), Rn = document.getElementById("dev-btn"), On = document.getElementById("dev-screen"), xn = document.getElementById("clear-save-btn"), Cn = document.getElementById("export-save-btn"), Dn = document.getElementById("import-save-btn"), Ie = document.getElementById("import-save-input"), kn = document.getElementById("close-dev-btn"), Ft = document.querySelector(".record-light"), Li = document.querySelectorAll(".episode-btn"), Nn = document.getElementById("return-title-btn"), Bn = document.getElementById("mute-music-btn"), Pn = document.getElementById("mute-sfx-btn"), Lt = document.getElementById("music-volume"), It = document.getElementById("sfx-volume");
let Ze = null, ee = [], xt = null;
async function Ii() {
  try {
    const t = await fetch("dist/episodes/manifest.json");
    if (!t.ok) throw new Error(`HTTP ${t.status}`);
    (await t.json()).forEach((o) => {
      const s = document.createElement("script");
      s.src = `dist/episodes/${o}.js`, document.body.appendChild(s);
    });
  } catch (t) {
    console.error("Failed to load episode scripts", t);
  }
}
function te(t) {
  t.style.display = "flex", requestAnimationFrame(() => t.classList.add("visible"));
}
function U(t) {
  t.classList.remove("visible"), t.addEventListener("transitionend", function n() {
    t.style.display = "none", t.removeEventListener("transitionend", n);
  }, { once: !0 });
}
async function $e(t) {
  Ve(), et(), Vn(), U(it), Pt.style.display = "block", io(t), Ft.style.display = "block", Fo(), await Bt(t, xt), xt = null;
}
function wi(t) {
  Ze = t, et(), zo(), U(we), te(it), Ye.classList.remove("fade-out"), Ye.style.animation = "none", Ye.offsetHeight, Ye.style.animation = "", In.classList.remove("visible"), ee.forEach(clearTimeout), ee = [], ee.push(setTimeout(() => {
    In.classList.add("visible");
  }, 25e3)), ee.push(setTimeout(async () => {
    await $e(Ze);
  }, 3e4));
}
function uo() {
  Pt.style.display = "none", Ft.style.display = "none", Ze = null, ee.forEach(clearTimeout), U(it), kt(), Gn(), Hn(), nt();
  const t = document.getElementById("vhs-screen");
  t && (t.innerHTML = ""), xe(), Me(), te(we), Yn();
}
function Mi() {
  Pt.style.display = "none", Ft.style.display = "none", ee.forEach(clearTimeout), U(it), kt();
  const t = document.getElementById("vhs-screen");
  t && (t.innerHTML = ""), nt(), xe(), Me(), et(), te(de), Je();
}
function Ri() {
  document.addEventListener("keydown", lo), document.addEventListener("keydown", (c) => {
    if (c.key === "Escape") {
      const f = document.getElementById("history-overlay"), d = document.getElementById("case-file-overlay");
      f && f.classList.contains("visible") ? Rt() : d && d.classList.contains("visible") && Ot();
    }
  }), Ii(), vi.addEventListener("click", () => {
    fn(), Ve(), U(de), Wn(), Yn(), te(we);
  }), Nn && Nn.addEventListener("click", () => {
    U(we), kt(), et(), Je(), te(de);
  }), Mn && Mn.addEventListener("click", async () => {
    fn(), Ve(), U(de), xt = Ke().scene, await $e(Ke().episode || "1");
  }), Rn && Rn.addEventListener("click", () => {
    U(de), Ve(), te(On);
  }), kn && kn.addEventListener("click", () => {
    U(On), Je(), te(de);
  }), xn && xn.addEventListener("click", () => {
    Gn(), Hn(), Me(), alert("Save data cleared");
  }), Cn && Cn.addEventListener("click", () => {
    const c = Bo(), f = new Blob([JSON.stringify(c)], { type: "application/json" }), d = URL.createObjectURL(f), p = document.createElement("a");
    p.href = d, p.download = "echo-tape-save.json", document.body.appendChild(p), p.click(), document.body.removeChild(p), URL.revokeObjectURL(d);
  }), Dn && Ie && (Dn.addEventListener("click", () => Ie.click()), Ie.addEventListener("change", () => {
    const c = Ie.files[0];
    if (!c) return;
    const f = new FileReader();
    f.onload = () => {
      try {
        const d = JSON.parse(f.result);
        Po(d), Me(), alert("Save data imported");
      } catch {
        alert("Invalid save file");
      }
    }, f.readAsText(c), Ie.value = "";
  })), Li.forEach((c) => {
    c.addEventListener("click", async () => {
      const f = c.dataset.episode;
      f === "1" ? wi(f) : (U(we), await $e(f));
    });
  });
  const t = document.getElementById("back-btn"), n = document.getElementById("history-btn"), o = document.getElementById("close-history-btn"), s = document.getElementById("case-file-btn"), l = document.getElementById("close-case-file-btn");
  t && t.addEventListener("click", () => ao(Mi)), n && n.addEventListener("click", ro), o && o.addEventListener("click", Rt), s && s.addEventListener("click", co), l && l.addEventListener("click", Ot), Bn && Bn.addEventListener("click", () => {
    const c = !Go();
    qn(c), fe("musicMuted", c);
  }), Pn && Pn.addEventListener("click", () => {
    const c = !Wo();
    jn(c), fe("sfxMuted", c);
  }), Lt && Lt.addEventListener("input", () => {
    const c = parseFloat(Lt.value);
    $n(c), fe("musicVolume", c);
  }), It && It.addEventListener("input", () => {
    const c = parseFloat(It.value);
    Xn(c), fe("sfxVolume", c);
  }), document.addEventListener("click", (c) => {
    const f = c.target.closest("button");
    if (f) {
      if (Ho(), f.dataset.setState)
        try {
          const d = JSON.parse(f.dataset.setState);
          for (const p in d)
            fe(p, d[p]);
        } catch (d) {
          console.error("Invalid data-set-state", d);
        }
      f.dataset.scene ? ot(f.dataset.scene) : f.dataset.restart !== void 0 && uo();
    }
  }), wn && wn.addEventListener("click", async () => {
    ee.forEach(clearTimeout), Vn(), await $e(Ze || "1");
  }), xe();
}
const { goToScene: Oi, updateContinueButton: xi } = bi;
Co();
ko();
qn(ne("musicMuted"));
jn(ne("sfxMuted"));
$n(ne("musicVolume"));
Xn(ne("sfxVolume"));
Oe();
Ri();
xi();
window.setState = fe;
window.getState = ne;
window.goToScene = Oi;
window.restartGame = uo;
Je();
