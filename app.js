let messages = [
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
    createdAt: "2026-06-15",
    updatedAt: "2026-06-17",
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
    createdAt: "2026-06-16",
    updatedAt: "2026-06-17",
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
    createdAt: "2026-06-03",
    updatedAt: "2026-06-17",
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
    createdAt: "2026-06-17",
    updatedAt: "2026-06-17",
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

const stageOrder = ["简历待筛", "通过初筛", "待一面", "待二面", "已发offer", "已入职", "终止"];
const state = {
  imported: false,
  candidates: [],
  roleFilter: "all",
  ownerFilter: "all",
  selectedCandidateId: "",
  reportPeriod: "week",
  apiMode: window.location.protocol !== "file:",
};

const dom = {
  workspace: document.querySelector(".workspace"),
  navItems: document.querySelectorAll(".nav-item"),
  importBtn: document.querySelector("#importBtn"),
  chatFeed: document.querySelector("#chatFeed"),
  parseStatus: document.querySelector("#parseStatus"),
  roleFilter: document.querySelector("#roleFilter"),
  ownerFilter: document.querySelector("#ownerFilter"),
  reportPeriodBtns: document.querySelectorAll("[data-report-period]"),
  reportMetrics: document.querySelector("#reportMetrics"),
  reportStageBars: document.querySelector("#reportStageBars"),
  reportOwnerBars: document.querySelector("#reportOwnerBars"),
  reportSourceBars: document.querySelector("#reportSourceBars"),
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
  dom.workspace.classList.remove("view-overview", "view-wechat", "view-ledger", "view-alerts", "view-reports", "view-talent");
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

async function apiRequest(path, options = {}) {
  if (!state.apiMode) {
    throw new Error("当前通过 file:// 打开，使用本地模拟数据");
  }

  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "接口请求失败" }));
    throw new Error(error.error || "接口请求失败");
  }

  return response.json();
}

async function persistCandidate(candidate) {
  if (!state.apiMode || !state.imported) return;
  try {
    await apiRequest(`/api/candidates/${candidate.id}`, {
      method: "PATCH",
      body: JSON.stringify(candidate),
    });
  } catch (error) {
    console.warn("候选人保存到后端失败，已保留前端状态：", error.message);
  }
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
    count:
      stage === "终止"
        ? state.candidates.filter((candidate) => candidate.stopped).length
        : candidates.filter((candidate) => candidate.stage === stage).length,
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
    .filter((candidate) => candidate.risk && candidate.todoStatus !== "已完成")
    .map((candidate) => {
      if (candidate.risk === "duplicate") {
        return {
          level: "",
          id: candidate.id,
          type: candidate.risk,
          title: `${candidate.name} 可能重复建档`,
          desc: "AI 发现同名同岗位记录，需要 HR 确认是否保留最新作品集信息并合并档案。",
        };
      }
      return {
        level: "danger",
        id: candidate.id,
        type: candidate.risk,
        title: `${candidate.name} 信息不完整`,
        desc: "需要 HR 补齐电话、面试时间等缺失字段，再同步为正式台账。",
      };
    });

  dom.alerts.innerHTML = alerts.length
    ? alerts
        .map(
          (alert) => `
            <div class="alert-item ${alert.level}">
              <strong>${alert.title}</strong>
              <p>${alert.desc}</p>
              <div class="alert-actions">
                <button class="small-btn" data-alert-action="open" data-candidate-id="${alert.id}">查看档案</button>
                ${
                  alert.type === "duplicate"
                    ? `<button class="small-btn" data-alert-action="merge" data-candidate-id="${alert.id}">确认合并</button>`
                    : `<button class="small-btn" data-alert-action="resolve" data-candidate-id="${alert.id}">确认已补齐</button>`
                }
              </div>
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

function getPeriodStart(period) {
  const now = new Date("2026-06-17T00:00:00");
  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  const day = now.getDay() || 7;
  const start = new Date(now);
  start.setDate(now.getDate() - day + 1);
  return start;
}

function isInPeriod(dateText, period) {
  const date = new Date(`${dateText}T00:00:00`);
  return date >= getPeriodStart(period);
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "未填写";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function renderReportBars(target, entries) {
  const max = Math.max(...entries.map(([, count]) => count), 1);
  target.innerHTML = entries.length
    ? entries
        .map(
          ([label, count]) => `
            <div class="funnel-row">
              <span>${label}</span>
              <div class="bar-track">
                <div class="bar-fill" style="width:${(count / max) * 100}%"></div>
              </div>
              <strong>${count}</strong>
            </div>
          `
        )
        .join("")
    : `<div class="empty">当前周期暂无数据</div>`;
}

function renderReports() {
  const period = state.reportPeriod;
  const periodCandidates = state.candidates.filter((candidate) => isInPeriod(candidate.createdAt, period));
  const periodUpdated = state.candidates.filter((candidate) => isInPeriod(candidate.updatedAt, period));
  const stopped = periodUpdated.filter((candidate) => candidate.stopped).length;
  const synced = periodUpdated.filter((candidate) => candidate.sync === "已同步").length;
  const risks = periodUpdated.filter((candidate) => candidate.risk).length;
  const offers = periodUpdated.filter((candidate) => candidate.stage === "已发offer" || candidate.stage === "已入职").length;

  dom.reportMetrics.innerHTML = [
    ["新增候选人", periodCandidates.length, "本周期 AI 结构化入库"],
    ["推进/更新", periodUpdated.length, "阶段、档案或同步变更"],
    ["Offer/入职", offers, "已发offer及已入职"],
    ["终止进入储备", stopped, "转入人才储备库"],
    ["已同步", synced, "写入台账状态"],
    ["待处理风险", risks, "仍需 HR 确认"],
  ]
    .map(
      ([label, value, desc]) => `
        <article class="metric-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <p>${desc}</p>
        </article>
      `
    )
    .join("");

  const stageEntries = stageOrder.map((stage) => [
    stage,
    stage === "终止"
      ? periodUpdated.filter((candidate) => candidate.stopped).length
      : periodUpdated.filter((candidate) => candidate.stage === stage && !candidate.stopped).length,
  ]);
  renderReportBars(dom.reportStageBars, stageEntries);
  renderReportBars(dom.reportOwnerBars, Object.entries(countBy(periodUpdated, "owner")));
  renderReportBars(dom.reportSourceBars, Object.entries(countBy(periodUpdated, "source")));
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
  candidate.stage = candidate.stopped ? "终止" : candidate.stage === "终止" ? "简历待筛" : candidate.stage;
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

  if (candidate.risk === "missing" && candidate.phone && candidate.phone !== "待补充" && !candidate.schedule.includes("待确认")) {
    resolveCandidateTodo(candidate.id, "resolve", false);
  }

  persistCandidate(candidate);
  renderFilters();
  render();
  closeCandidateDialog();
}

function resolveCandidateTodo(candidateId, action, shouldRender = true) {
  const candidate = state.candidates.find((item) => item.id === candidateId);
  if (!candidate) return;

  if (action === "merge") {
    candidate.tags = candidate.tags.filter((tag) => tag !== "重复合并");
    candidate.tags.push("已确认合并");
  }

  if (action === "resolve") {
    candidate.tags = candidate.tags.filter((tag) => !tag.includes("缺"));
    candidate.tags.push("信息已确认");
  }

  candidate.risk = "";
  candidate.todoStatus = "已完成";
  candidate.sync = "已同步";
  persistCandidate(candidate);

  if (shouldRender) {
    renderFilters();
    render();
  }
}

function render() {
  const filtered = getFilteredCandidates();
  renderMetrics(filtered);
  renderFunnel(filtered);
  renderAlerts(filtered);
  renderTable(filtered);
  renderTalentPool();
  renderReports();
}

async function importMessages() {
  dom.parseStatus.textContent = "AI 解析中";
  dom.parseStatus.className = "status-pill active";
  dom.importBtn.disabled = true;
  dom.importBtn.textContent = "解析中...";

  try {
    const result = await apiRequest("/api/wecom/import-today", { method: "POST" });
    state.imported = true;
    messages = result.messages || messages;
    state.candidates = result.candidates || [];
    renderChat();
    renderFilters();
    render();
    dom.parseStatus.textContent = `已抽取 ${state.candidates.length} 条记录`;
  } catch (error) {
    window.setTimeout(() => {
      state.imported = true;
      state.candidates = structuredClone(baseCandidates);
      renderFilters();
      render();
      dom.parseStatus.textContent = "本地模拟：已抽取 4 条记录";
    }, 400);
  } finally {
    window.setTimeout(() => {
      dom.importBtn.disabled = false;
      dom.importBtn.textContent = "重新导入群聊";
    }, 450);
  }
}

dom.importBtn.addEventListener("click", importMessages);
dom.navItems.forEach((item) => {
  item.addEventListener("click", () => showSection(item.dataset.view, item.dataset.target));
});
dom.reportPeriodBtns.forEach((button) => {
  button.addEventListener("click", () => {
    state.reportPeriod = button.dataset.reportPeriod;
    dom.reportPeriodBtns.forEach((item) => item.classList.toggle("active", item === button));
    renderReports();
  });
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
dom.alerts.addEventListener("click", (event) => {
  const button = event.target.closest("[data-alert-action]");
  if (!button) return;
  const action = button.dataset.alertAction;
  if (action === "open") {
    openCandidateDialog(button.dataset.candidateId);
    return;
  }
  resolveCandidateTodo(button.dataset.candidateId, action);
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
