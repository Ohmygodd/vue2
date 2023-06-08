import { parseHTML } from "./parse.js";
function genProps(attrs) {
    console.log(attrs);
    let str = "";
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === "style") {
            let obj = {};
            attr.value.split(";").forEach((item) => {
                let [key, value] = item.split(":");
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    console.log(str);
    return `{${str.slice(0, -1)}}`;
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function gen(node) {
    console.log(node);
    if (node.type === 1) {
        return codegen(node);
    } else {
        let text = node.text;
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`;
        } else {
            let tokens = [];
            let match;
            defaultTagRE.lastIndex = 0; // 重置位置
            let lastIndex = 0;
            while ((match = defaultTagRE.exec(text))) {
                let index = match.index;
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                }
                tokens.push(`_s(${match[1].trim()})`);
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            console.log(tokens);
            return `_v(${tokens.join("+")})`;
        }
        // return 'sss'
    }
}
function genChildren(children) {
    // const children = el.children;

    // if (children) {
    return children.map((child) => gen(child)).join(",");
    // }
}
function codegen(ast) {
    let children = genChildren(ast.children);
    let code = `_c('${ast.tag}',${
        ast.attrs.length > 0 ? genProps(ast.attrs) : "null"
    }${ast.children.length ? `,${children}` : ``})`;
    return code;
}
// 对模板进行编译
export function complieToFuntion(template) {
    // templat => ast`
    // 生成render方法
    // debugger
    let ast = parseHTML(template);
    let code = codegen(ast)
    code = `with(this){return ${code}}`;
    let render = new Function(code)

    return render;
}
