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

const baseCandidates = [
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
    stage: "已 Offer",
    schedule: "6 月 24 日入职",
    owner: "Carol",
    tags: ["Offer 跟进入职"],
    sync: "已同步",
    risk: "",
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

const stageOrder = ["简历待筛", "通过初筛", "待一面", "已 Offer", "已入职"];
const state = {
  imported: false,
  candidates: [],
  roleFilter: "all",
  ownerFilter: "all",
  selectedCandidateId: "",
};

const dom = {
  workspace: document.querySelector(".workspace"),
  navItems: document.querySelectorAll(".nav-item"),
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
  talentCount: document.querySelector("#talentCount"),
  funnel: document.querySelector("#funnel"),
  alerts: document.querySelector("#alerts"),
  candidateRows: document.querySelector("#candidateRows"),
  talentRows: document.querySelector("#talentRows"),
  candidateDialog: document.querySelector("#candidateDialog"),
  candidateForm: document.querySelector("#candidateForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  closeDialogBtn: document.querySelector("#closeDialogBtn"),
  cancelDialogBtn: document.querySelector("#cancelDialogBtn"),
  stageEditor: document.querySelector("#stageEditor"),
};

function setActiveNav(view) {
  dom.navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });
}

function setActiveView(view) {
  dom.workspace.classList.remove("view-overview", "view-wechat", "view-ledger", "view-alerts", "view-talent");
  dom.workspace.classList.add(`view-${view}`);
  setActiveNav(view);
}

function showSection(view, targetId) {
  setActiveView(view);
  const section = document.querySelector(`#${targetId}`);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

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

function getActiveCandidates() {
  return state.candidates.filter((candidate) => !candidate.stopped);
}

function getFilteredCandidates() {
  return getActiveCandidates().filter((candidate) => {
    const roleMatched = state.roleFilter === "all" || candidate.role === state.roleFilter;
    const ownerMatched = state.ownerFilter === "all" || candidate.owner === state.ownerFilter;
    return roleMatched && ownerMatched;
  });
}

function renderFilters() {
  const activeCandidates = getActiveCandidates();
  const roles = [...new Set(activeCandidates.map((candidate) => candidate.role))];
  const owners = [...new Set(activeCandidates.map((candidate) => candidate.owner))];
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
  const stopped = state.candidates.filter((candidate) => candidate.stopped).length;
  dom.totalCandidates.textContent = candidates.length;
  dom.pendingReview.textContent = pending;
  dom.syncedCount.textContent = synced;
  dom.riskCount.textContent = risks;
  dom.savedMinutes.textContent = `${getActiveCandidates().length * 8} 分钟`;
  dom.talentCount.textContent = `${stopped} 人`;
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

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
              <td><button class="small-btn" data-candidate-id="${candidate.id}">查看/编辑</button></td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="9" class="empty">点击“导入今日群聊”生成 AI 招聘台账</td></tr>`;
}

function getStopReason(candidate) {
  const failed = candidate.evaluations.find((item) => item.result === "不通过" && item.reason);
  const latestReason = [...candidate.evaluations].reverse().find((item) => item.reason);
  return candidate.stopReason || failed?.reason || latestReason?.reason || "人工确认停止流程";
}

function getLastStage(candidate) {
  const active = [...candidate.evaluations].reverse().find((item) => item.result !== "待开始");
  return active ? `${active.stage}：${active.result}` : candidate.stage;
}

function renderTalentPool() {
  const stoppedCandidates = state.candidates.filter((candidate) => candidate.stopped);
  dom.talentRows.innerHTML = stoppedCandidates.length
    ? stoppedCandidates
        .map(
          (candidate) => `
            <tr>
              <td><strong>${candidate.name}</strong></td>
              <td>${candidate.role}</td>
              <td>${candidate.degree} / ${candidate.school}<br><span class="muted-text">${candidate.schoolTier}</span></td>
              <td>${candidate.phone}<br><span class="muted-text">${candidate.email}</span></td>
              <td>${getStopReason(candidate)}</td>
              <td>${getLastStage(candidate)}</td>
              <td><button class="small-btn" data-candidate-id="${candidate.id}">查看/编辑</button></td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="7" class="empty">暂无停止招聘流程的人才。可在候选人档案中勾选“停止该应聘者招聘流程”后保存。</td></tr>`;
}

function setField(name, value) {
  const field = dom.candidateForm.elements[name];
  if (field) field.value = value || "";
}

function renderStageEditor(candidate) {
  dom.stageEditor.innerHTML = candidate.evaluations
    .map(
      (item, index) => `
        <article class="stage-card">
          <div class="stage-card-head">
            <strong>${item.stage}</strong>
            <select name="stageResult-${index}">
              ${["待开始", "待安排", "待评估", "通过", "不通过"].map((result) => `<option value="${result}" ${item.result === result ? "selected" : ""}>${result}</option>`).join("")}
            </select>
          </div>
          <label>
            表现评价
            <textarea name="stagePerformance-${index}" rows="3">${escapeHTML(item.performance)}</textarea>
          </label>
          <label>
            通过/不通过原因
            <input name="stageReason-${index}" value="${escapeHTML(item.reason)}">
          </label>
        </article>
      `
    )
    .join("");
}

function openCandidateDialog(candidateId) {
  const candidate = state.candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  state.selectedCandidateId = candidateId;
  dom.dialogTitle.textContent = `${candidate.name} - ${candidate.role}`;
  setField("name", candidate.name);
  setField("gender", candidate.gender);
  setField("degree", candidate.degree);
  setField("school", candidate.school);
  setField("schoolTier", candidate.schoolTier);
  setField("phone", candidate.phone);
  setField("email", candidate.email);
  setField("role", candidate.role);
  setField("stopReason", candidate.stopReason);
  dom.candidateForm.elements.stopped.checked = candidate.stopped;
  renderStageEditor(candidate);
  dom.candidateDialog.showModal();
}

function closeCandidateDialog() {
  state.selectedCandidateId = "";
  dom.candidateDialog.close();
}

function saveCandidate(event) {
  event.preventDefault();
  const candidate = state.candidates.find((item) => item.id === state.selectedCandidateId);
  if (!candidate) return;

  candidate.name = dom.candidateForm.elements.name.value.trim();
  candidate.gender = dom.candidateForm.elements.gender.value;
  candidate.degree = dom.candidateForm.elements.degree.value.trim();
  candidate.school = dom.candidateForm.elements.school.value.trim();
  candidate.schoolTier = dom.candidateForm.elements.schoolTier.value;
  candidate.phone = dom.candidateForm.elements.phone.value.trim();
  candidate.email = dom.candidateForm.elements.email.value.trim();
  candidate.role = dom.candidateForm.elements.role.value.trim();
  candidate.stopped = dom.candidateForm.elements.stopped.checked;
  candidate.stopReason = dom.candidateForm.elements.stopReason.value.trim();
  candidate.tags = [
    candidate.schoolTier,
    candidate.stopped ? "流程已停止" : candidate.tags.find((tag) => tag.includes("缺") || tag.includes("重复")) || "档案已维护",
  ].filter(Boolean);

  candidate.evaluations = candidate.evaluations.map((item, index) => ({
    ...item,
    result: dom.candidateForm.elements[`stageResult-${index}`].value,
    performance: dom.candidateForm.elements[`stagePerformance-${index}`].value.trim(),
    reason: dom.candidateForm.elements[`stageReason-${index}`].value.trim(),
  }));

  renderFilters();
  render();
  closeCandidateDialog();
}

function render() {
  const filtered = getFilteredCandidates();
  renderMetrics(filtered);
  renderFunnel(filtered);
  renderAlerts(filtered);
  renderTable(filtered);
  renderTalentPool();
}

function importMessages() {
  dom.parseStatus.textContent = "AI 解析中";
  dom.parseStatus.className = "status-pill active";
  dom.importBtn.disabled = true;
  dom.importBtn.textContent = "解析中...";

  window.setTimeout(() => {
    state.imported = true;
    state.candidates = structuredClone(baseCandidates);
    renderFilters();
    render();
    dom.parseStatus.textContent = "已抽取 4 条记录";
    dom.importBtn.disabled = false;
    dom.importBtn.textContent = "重新导入群聊";
  }, 600);
}

dom.importBtn.addEventListener("click", importMessages);
dom.navItems.forEach((item) => {
  item.addEventListener("click", () => showSection(item.dataset.view, item.dataset.target));
});
dom.candidateRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-candidate-id]");
  if (!button) return;
  openCandidateDialog(button.dataset.candidateId);
});
dom.talentRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-candidate-id]");
  if (!button) return;
  openCandidateDialog(button.dataset.candidateId);
});
dom.candidateForm.addEventListener("submit", saveCandidate);
dom.closeDialogBtn.addEventListener("click", closeCandidateDialog);
dom.cancelDialogBtn.addEventListener("click", closeCandidateDialog);
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
