const reports = {
  name: "报告事件",
  fields: {
    id: "ID",
    received_ts: "报告时间",
    user_id: "报告者",
    name: "房间名",
    score: "分数",
    reason: "原因",
    event_id: "事件 ID",
    sender: "发送者",
  },
  action: {
    erase: {
      title: "删除被举报事件",
      content: "确定要删除该被举报事件吗？此操作不可撤销。",
    },
    event_lookup: {
      label: "事件查询",
      title: "按ID获取事件",
      fetch: "获取",
    },
    fetch_event_error: "获取事件失败",
  },
};

export default reports;
