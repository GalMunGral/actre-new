import { TabBar, Box, Icon } from "./Mailbox.decor";

const iconMap = {
  primary: "inbox",
  social: "user-friends",
  promotions: "tag",
};

const Tab = ({ name, key, active, onclick }) =>
  // use-transform
  Box({ name, key, active, onclick }, [
    Icon({ className: `fas fa-${iconMap[name]}` }),
    p(name),
  ]);

const Tabs = ({ folder, activeTab }, context) => {
  const { $mails } = context;

  const resetPage = (tab) => {
    $mails.tab = tab;
    $mails.pageIndex = 0;
  };

  return folder === "inbox"
    ? // use-transform
      TabBar(
        ["primary", "social", "promotions"].map((tab) =>
          Tab(
            (name = tab),
            (key = tab),
            (active = tab === activeTab),
            (onclick = () => resetPage(tab))
          )
        )
      )
    : [null];
};

export default Tabs;