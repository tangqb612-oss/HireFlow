const messages = [
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
    text: "王雨晴，产品经理，内推，已发 offer，预计 6 月 24 日入职，负责人 Carol。",
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

const baseCandidates = [
  {
    name: "张晨",
    role: "前端工程师",
    source: "Boss 直聘",
    stage: "待一面",
    schedule: "6 月 18 日 14:00",
    owner: "Alice",
    tags: ["React 5 年", "重复合并"],
    sync: "已同步",
    risk: "duplicate",
  },
  {
    name: "李航",
    role: "后端工程师",
    source: "企业微信推荐",
    stage: "通过初筛",
    schedule: "面试时间待确认",
    owner: "Bob",
    tags: ["Java", "缺面试时间"],
    sync: "待确认",
    risk: "missing",
  },
  {
    name: "王雨晴",
    role: "产品经理",
    source: "内推",
    stage: "已 Offer",
    schedule: "6 月 24 日入职",
    owner: "Carol",
    tags: ["Offer 跟进入职"],
    sync: "已同步",
    risk: "",
  },
  {
    name: "赵一鸣",
    role: "数据分析师",
    source: "拉勾",
    stage: "简历待筛",
    schedule: "今日待处理",
    owner: "Alice",
    tags: ["缺联系电话", "待筛选"],
    sync: "待确认",
    risk: "missing",
  },
];

const stageOrder = ["简历待筛", "通过初筛", "待一面", "已 Offer", "已入职"];
const state = {
  imported: false,
  candidates: [],
  roleFilter: "all",
  ownerFilter: "all",
};

const dom = {
  importBtn: document.querySelector("#importBtn"),
  chatFeed: document.querySelector("#chatFeed"),
  parseStatus: document.querySelector("#parseStatus"),
  roleFilter: document.querySelector("#roleFilter"),
  ownerFilter: document.querySelector("#ownerFilter"),
  totalCandidates: document.querySelector("#totalCandidates"),
  pendingReview: document.querySelector("#pendingReview"),
  syncedCount: document.querySelector("#syncedCount"),
  riskCount: document.querySelector("#riskCount"),
  savedMinutes: document.querySelector("#savedMinutes"),
  funnel: document.querySelector("#funnel"),
  alerts: document.querySelector("#alerts"),
  candidateRows: document.querySelector("#candidateRows"),
};

function renderChat() {
  dom.chatFeed.innerHTML = messages
    .map(
      (message) => `
        <div class="chat-item">
          <strong>${message.sender}</strong>
          <p>${message.text}</p>
        </div>
      `
    )
    .join("");
}

function getFilteredCandidates() {
  return state.candidates.filter((candidate) => {
    const roleMatched = state.roleFilter === "all" || candidate.role === state.roleFilter;
    const ownerMatched = state.ownerFilter === "all" || candidate.owner === state.ownerFilter;
    return roleMatched && ownerMatched;
  });
}

function renderFilters() {
  const roles = [...new Set(state.candidates.map((candidate) => candidate.role))];
  const owners = [...new Set(state.candidates.map((candidate) => candidate.owner))];
  dom.roleFilter.innerHTML = `<option value="all">全部岗位</option>${roles
    .map((role) => `<option value="${role}">${role}</option>`)
    .join("")}`;
  dom.ownerFilter.innerHTML = `<option value="all">全部负责人</option>${owners
    .map((owner) => `<option value="${owner}">${owner}</option>`)
    .join("")}`;
  dom.roleFilter.value = state.roleFilter;
  dom.ownerFilter.value = state.ownerFilter;
}

function renderMetrics(candidates) {
  const pending = candidates.filter((candidate) => candidate.sync !== "已同步").length;
  const synced = candidates.filter((candidate) => candidate.sync === "已同步").length;
  const risks = candidates.filter((candidate) => candidate.risk).length;
  dom.totalCandidates.textContent = candidates.length;
  dom.pendingReview.textContent = pending;
  dom.syncedCount.textContent = synced;
  dom.riskCount.textContent = risks;
  dom.savedMinutes.textContent = `${state.candidates.length * 8} 分钟`;
}

function renderFunnel(candidates) {
  const counts = stageOrder.map((stage) => ({
    stage,
    count: candidates.filter((candidate) => candidate.stage === stage).length,
  }));
  const max = Math.max(...counts.map((item) => item.count), 1);
  dom.funnel.innerHTML = counts
    .map(
      (item) => `
        <div class="funnel-row">
          <span>${item.stage}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width:${(item.count / max) * 100}%"></div>
          </div>
          <strong>${item.count}</strong>
        </div>
      `
    )
    .join("");
}

function renderAlerts(candidates) {
  const alerts = candidates
    .filter((candidate) => candidate.risk)
    .map((candidate) => {
      if (candidate.risk === "duplicate") {
        return {
          level: "",
          title: `${candidate.name} 可能重复建档`,
          desc: "AI 已合并同名同岗位记录，并保留最新作品集补充信息。",
        };
      }
      return {
        level: "danger",
        title: `${candidate.name} 信息不完整`,
        desc: "建议 HR 在企业微信中确认缺失字段后再同步为正式台账。",
      };
    });

  dom.alerts.innerHTML = alerts.length
    ? alerts
        .map(
          (alert) => `
            <div class="alert-item ${alert.level}">
              <strong>${alert.title}</strong>
              <p>${alert.desc}</p>
            </div>
          `
        )
        .join("")
    : `<div class="empty">当前筛选范围暂无风险提醒</div>`;
}

function tagClass(tag) {
  if (tag.includes("缺")) return "tag danger";
  if (tag.includes("重复")) return "tag warn";
  return "tag";
}

function renderTable(candidates) {
  dom.candidateRows.innerHTML = candidates.length
    ? candidates
        .map(
          (candidate) => `
            <tr>
              <td><strong>${candidate.name}</strong></td>
              <td>${candidate.role}</td>
              <td>${candidate.source}</td>
              <td>${candidate.stage}</td>
              <td>${candidate.schedule}</td>
              <td>${candidate.owner}</td>
              <td>${candidate.tags.map((tag) => `<span class="${tagClass(tag)}">${tag}</span>`).join("")}</td>
              <td class="${candidate.sync === "已同步" ? "sync-ok" : "sync-pending"}">${candidate.sync}</td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="8" class="empty">点击“导入今日群聊”生成 AI 招聘台账</td></tr>`;
}

function render() {
  const filtered = getFilteredCandidates();
  renderMetrics(filtered);
  renderFunnel(filtered);
  renderAlerts(filtered);
  renderTable(filtered);
}

function importMessages() {
  dom.parseStatus.textContent = "AI 解析中";
  dom.parseStatus.className = "status-pill active";
  dom.importBtn.disabled = true;
  dom.importBtn.textContent = "解析中...";

  window.setTimeout(() => {
    state.imported = true;
    state.candidates = [...baseCandidates];
    renderFilters();
    render();
    dom.parseStatus.textContent = "已抽取 4 条记录";
    dom.importBtn.disabled = false;
    dom.importBtn.textContent = "重新导入群聊";
  }, 600);
}

dom.importBtn.addEventListener("click", importMessages);
dom.roleFilter.addEventListener("change", (event) => {
  state.roleFilter = event.target.value;
  render();
});
dom.ownerFilter.addEventListener("change", (event) => {
  state.ownerFilter = event.target.value;
  render();
});

renderChat();
render();
