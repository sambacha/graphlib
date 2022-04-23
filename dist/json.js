"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.write = void 0;
const lodash_clone_1 = __importDefault(require("lodash.clone"));
const lodash_map_1 = __importDefault(require("lodash.map"));
const graph_1 = require("./graph");
function write(g) {
    const json = {
        options: {
            directed: g.isDirected(),
            multigraph: g.isMultigraph(),
            compound: g.isCompound(),
        },
        nodes: writeNodes(g),
        edges: writeEdges(g),
    };
    if (undefined !== g.graph()) {
        json.value = (0, lodash_clone_1.default)(g.graph());
    }
    return json;
}
exports.write = write;
function writeNodes(g) {
    return (0, lodash_map_1.default)(g.nodes(), function (v) {
        const nodeValue = g.node(v);
        const parent = g.parent(v);
        const node = { v: v };
        if (undefined !== nodeValue) {
            node.value = nodeValue;
        }
        if (undefined !== parent) {
            node.parent = parent;
        }
        return node;
    });
}
function writeEdges(g) {
    return (0, lodash_map_1.default)(g.edges(), function (e) {
        const edgeValue = g.edge(e);
        const edge = { v: e.v, w: e.w };
        if (undefined !== e.name) {
            edge.name = e.name;
        }
        if (undefined !== edgeValue) {
            edge.value = edgeValue;
        }
        return edge;
    });
}
function read(json) {
    var _a, _b;
    const g = new graph_1.Graph(json.options).setGraph(json.value);
    for (const entry of (_a = json.nodes) !== null && _a !== void 0 ? _a : []) {
        g.setNode(entry.v, entry.value);
        if (entry.parent) {
            g.setParent(entry.v, entry.parent);
        }
    }
    for (const entry of (_b = json.edges) !== null && _b !== void 0 ? _b : []) {
        g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
    }
    return g;
}
exports.read = read;
//# sourceMappingURL=json.js.map