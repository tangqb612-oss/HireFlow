const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const todayMessages = [
  {
    sender: "招聘群-上海研发",
    text: "张晨，前端工程师，来自 Boss 直聘，React 5 年经验，约 6 月 18 日 14:00 一面，负责人 Alice，手机号 138****1024。",
  },
  {
    sender: "企业微信-业务面试群",
    text: "后端岗位候选人李航通过初筛，Java/微服务经验匹配，Bob 跟进，面试时间还没确认。",
  },
  {
    sender: "招聘群-产品线",
    text: "王雨晴，产品经理，香港大学硕士，海外院校QS排名26，内推，已发 offer，预计 6 月 24 日入职，负责人 Carol。",
  },
  {
    sender: "企业微信-招聘协同群",
    text: "张晨今天补充了作品集链接，仍走前端工程师一面流程，请同步腾讯文档避免重复建档。",
  },
  {
    sender: "招聘群-上海研发",
    text: "数据分析师候选人赵一鸣，拉勾来源，简历待筛，缺联系电话，负责人 Alice。",
  },
];

const seedCandidates = [
  {
    id: "c-zhangchen",
    name: "张晨",
    gender: "男",
    degree: "本科",
    school: "上海交通大学",
    schoolTier: "985",
    phone: "138****1024",
    email: "zhangchen@example.com",
    role: "前端工程师",
    source: "Boss 直聘",
    stage: "待一面",
    schedule: "6 月 18 日 14:00",
    owner: "Alice",
    tags: ["React 5 年", "重复合并"],
    sync: "已同步",
    risk: "duplicate",
    todoStatus: "待处理",
    stopped: false,
    stopReason: "",
    evaluations: [
      { stage: "简历筛选", result: "通过", performance: "React 项目经验完整，作品集补充后匹配度提升。", reason: "技术栈匹配前端岗位" },
      { stage: "一面", result: "待评估", performance: "待面试官录入一面表现。", reason: "" },
      { stage: "二面", result: "待开始", performance: "", reason: "" },
      { stage: "Offer", result: "待开始", performance: "", reason: "" },
    ],
  },
  {
    id: "c-lihang",
    name: "李航",
    gender: "男",
    degree: "硕士",
    school: "华中科技大学",
    schoolTier: "985",
    phone: "待补充",
    email: "lihang@example.com",
    role: "后端工程师",
    source: "企业微信推荐",
    stage: "通过初筛",
    schedule: "面试时间待确认",
    owner: "Bob",
    tags: ["Java", "缺面试时间"],
    sync: "待确认",
    risk: "missing",
    todoStatus: "待处理",
    stopped: false,
    stopReason: "",
    evaluations: [
      { stage: "简历筛选", result: "通过", performance: "Java、微服务经验与岗位要求匹配。", reason: "基础条件符合" },
      { stage: "一面", result: "待安排", performance: "面试时间未确认。", reason: "需 HR 继续协调" },
      { stage: "二面", result: "待开始", performance: "", reason: "" },
      { stage: "Offer", result: "待开始", performance: "", reason: "" },
    ],
  },
  {
    id: "c-wangyuqing",
    name: "王雨晴",
    gender: "女",
    degree: "硕士",
    school: "香港大学",
    schoolTier: "海外院校QS排名26",
    phone: "136****8831",
    email: "wangyuqing@example.com",
    role: "产品经理",
    source: "内推",
    stage: "已发offer",
    schedule: "6 月 24 日入职",
    owner: "Carol",
    tags: ["Offer 跟进入职"],
    sync: "已同步",
    risk: "",
    todoStatus: "已完成",
    stopped: false,
    stopReason: "",
    evaluations: [
      { stage: "简历筛选", result: "通过", performance: "产品经验与业务线方向一致。", reason: "内推强匹配" },
      { stage: "一面", result: "通过", performance: "需求分析和沟通表达优秀。", reason: "业务理解较好" },
      { stage: "二面", result: "通过", performance: "方案拆解完整，推进意识强。", reason: "综合表现通过" },
      { stage: "Offer", result: "通过", performance: "已发 Offer，等待入职。", reason: "薪资和到岗时间已确认" },
    ],
  },
  {
    id: "c-zhaoyiming",
    name: "赵一鸣",
    gender: "男",
    degree: "本科",
    school: "南京大学",
    schoolTier: "985",
    phone: "待补充",
    email: "zhaoyiming@example.com",
    role: "数据分析师",
    source: "拉勾",
    stage: "简历待筛",
    schedule: "今日待处理",
    owner: "Alice",
    tags: ["缺联系电话", "待筛选"],
    sync: "待确认",
    risk: "missing",
    todoStatus: "待处理",
    stopped: false,
    stopReason: "",
    evaluations: [
      { stage: "简历筛选", result: "待评估", performance: "简历待筛，缺联系电话。", reason: "基础信息不完整" },
      { stage: "一面", result: "待开始", performance: "", reason: "" },
      { stage: "二面", result: "待开始", performance: "", reason: "" },
      { stage: "Offer", result: "待开始", performance: "", reason: "" },
    ],
  },
];

let candidates = [];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function mergeCandidate(candidate, patch) {
  const allowed = [
    "name",
    "gender",
    "degree",
    "school",
    "schoolTier",
    "phone",
    "email",
    "role",
    "source",
    "stage",
    "schedule",
    "owner",
    "tags",
    "sync",
    "risk",
    "todoStatus",
    "stopped",
    "stopReason",
    "evaluations",
  ];
  allowed.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(patch, key)) {
      candidate[key] = patch[key];
    }
  });
}

function handleStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(ROOT, requestedPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(content);
  });
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, mode: "mock-wecom-import" });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/wecom/import-today") {
    // Replace this block with WeCom auth + chat archive pulling when corp credentials are available.
    candidates = clone(seedCandidates);
    sendJson(res, 200, {
      source: "mock-wecom-chat-archive",
      importedAt: new Date().toISOString(),
      messages: clone(todayMessages),
      candidates: clone(candidates),
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/candidates") {
    sendJson(res, 200, { candidates: clone(candidates) });
    return;
  }

  const candidateMatch = url.pathname.match(/^\/api\/candidates\/([^/]+)$/);
  if (req.method === "PATCH" && candidateMatch) {
    const candidate = candidates.find((item) => item.id === candidateMatch[1]);
    if (!candidate) {
      sendJson(res, 404, { error: "Candidate not found" });
      return;
    }
    const patch = await readBody(req);
    mergeCandidate(candidate, patch);
    sendJson(res, 200, { candidate: clone(candidate) });
    return;
  }

  sendJson(res, 404, { error: "API endpoint not found" });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res).catch((error) => {
      sendJson(res, 400, { error: error.message });
    });
    return;
  }

  handleStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`HireFlow running at http://localhost:${PORT}`);
});
