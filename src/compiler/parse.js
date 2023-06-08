const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;

var qnameCapture = `((?:${ncname}\\:)?${ncname})`;
var startTagOpen = new RegExp(`^<${qnameCapture}`);
var attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute =
    /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

// const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

// const startTag0pen = new RegExp(`^<${qnameCapture}`); // 匹配到开始标签
// const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配到结束标签
// const attribute =
// /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;; // 匹配属性
// const startTagClose = /^\s*(\/?)>/;
// const defaultTagRE = /\{\{((?:. |\r?\n)+?)\}\}/g;

export function parseHTML(html) {

    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = []; // 栈
    let currentParent; // 指向栈中最后一个元素
    let root;

    function createASTElement(tag,attrs) {
      return {
        tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs,
        parent: null,
      }
    }
    function start(tag, attrs) {
      // console.log(tag, attrs, 'kaishi');
      const node = createASTElement(tag,attrs) // 创建一个ast节点
      if (!root) { // 如果当前root为null，则当前节点为根结点
        root = node;
      }
      if (currentParent) {
        node.parent = currentParent
        currentParent.children.push(node)
      }
      stack.push(node);
      currentParent = node;
    }
    function chars(text) {
      text  = text.replace(/\s/g,'')
      // console.log(text, 'wenben');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent
      })

    }
    function end(tag) {
      // console.log(tag, 'jieshu');
      stack.pop();
      currentParent = stack[stack.length - 1]

    }
    function advance(n) {
        html = html.substring(n);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        // console.log(start);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            };
            advance(start[0].length);
            let attr, end;
            // console.log(match, html);

            while (
                !(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))
            ) {
                advance(attr[0].length);
                // console.log(11);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || true,
                });
            }
            if (end) {
                advance(end[0].length);
            }
            // console.log(html);
            // console.log(match);
            return match;
        }
        // 如果不是结束标签就一直匹配

        return false;
    }
    while (html) {
        // debugger
        // 如果为0是开始标签  >0则是结束标签
        let textEnd = html.indexOf("<");
        if (textEnd == 0) {
            const startTagMatch = parseStartTag();
            // console.log('开始标签的匹配结果：',startTagMatch);
            if (startTagMatch) {
              start(startTagMatch.tagName, startTagMatch.attrs);
                // console.log(html);
                continue;
            }
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
              advance(endTagMatch[0].length);
              end(endTagMatch[1]);
                continue;
            }
        }
        if (textEnd > 0) {
            let text = html.substring(0, textEnd);
            if (text) {
                chars(text);
                advance(text.length);
                // console.log(html);
            }
            // break;
        }
        // }
        // }
    }
    // console.log(root);
    return root;
}