import { cnst } from "@shared/util";
import { gql, utils, store } from "../../../stores";

export const useMocSurvey = () => {
  const self = store.platform.user.use.self();
  const type = store.mocSurvey.use.type();
  const title = store.mocSurvey.use.title();
  const answer = store.mocSurvey.use.answer();
  const wallet = store.shared.wallet.use.wallet();
  const openAt = store.mocSurvey.use.openAt();
  const closeAt = store.mocSurvey.use.closeAt();
  const filter = store.mocSurvey.use.filter();
  const mocSurvey = store.mocSurvey.use.mocSurvey();
  const mocSurveyList = store.mocSurvey.use.mocSurveyList();
  const isWriteMode = store.mocSurvey.use.isWriteMode();
  const description = store.mocSurvey.use.description();
  const selection = store.mocSurvey.use.selection();
  const selections = store.mocSurvey.use.selections();
  const today = new Date();
  const maxDay = new Date(today.getTime() + 1000 * 60 * 60 * 24 * 60);
  const allCount = store.mocSurvey.use.mocSurveyList().filter((survey) => ["opened", "closed"].includes(survey.status))
    .length;
  const activeCount = store.mocSurvey.use.mocSurveyList().filter((mocSurvey) => utils.checkIsActiveSurvey(mocSurvey))
    .length;
  const isVoted = (mocSurveyId: string) =>
    (self &&
      self.keyring &&
      self.keyring.wallets.some((wallet) => utils.isVoted(mocSurveyList, mocSurveyId, self?.id))) ??
    false;

  const sign = store.shared.keyring.use.sign();

  const createMocSurvey = store.mocSurvey.use.createMocSurvey();

  const hasMmoc = () => (self ? self.items.some((item) => item.thing.name === "MMOC") : false);

  const findResponse = store.mocSurvey.use.findResponse();

  const initSurvey = store.mocSurvey.use.initMocSurvey();

  const signWalletConnect = store.shared.keyring.use.signWalletConnect();

  const response = store.mocSurvey.use.responseMocSurvey();

  const creatable = () =>
    hasMmoc() &&
    title &&
    openAt &&
    closeAt &&
    selections.length > 1 &&
    selections.every((selection) => selection.length > 2)
      ? true
      : false;

  const create = async () => {
    if (!self || !self.keyring) return alert("로그인 한 유저만 투표할 수 있습니다.");
    if (!wallet) return;
    const thing = self.items.find((item) => item.thing.name === "MMOC");
    if (!thing) return alert("MMOC를 보유한 유저만 투표할 수 있습니다.");
    store.mocSurvey.setState({ creator: self, policy: [] });
    await sign(wallet.network.provider);
    await createMocSurvey();
    await initSurvey({});
    store.mocSurvey.setState({ isWriteMode: false });
  };

  const updateObjective = (value: string, itemIndex: number) => {
    let newSelections = [""];
    if (selections && selections.length) newSelections = [...selections];
    store.mocSurvey.setState({ selections: newSelections?.map((cur, index) => (index === itemIndex ? value : cur)) });
  };

  const openCreateBox = () => store.mocSurvey.setState({ isWriteMode: true });

  const closeCreateBox = () => store.mocSurvey.setState({ isWriteMode: false });

  const addObjective = () =>
    store.mocSurvey.setState(selections ? { selections: [...selections, ""] } : { selections: [""] });

  const removeObjective = (itemIndex: number) =>
    store.mocSurvey.setState({ selections: selections?.filter((cur, index) => index !== itemIndex) });

  const changeFilter = (filter: cnst.SurveyFilterType) => store.mocSurvey.setState({ filter });

  const responseMocSurvey = async () => {
    if (!self || !self.keyring) return alert("로그인 한 유저만 투표할 수 있습니다.");
    if (!wallet) return alert("해당 컨트랙 네트워크의 지갑을 소유하고 있지 않습니다.");
    if (!mocSurvey) return alert("설문조사가 존재하지 않습니다.");
    await sign(wallet.network.provider);
    store.mocSurvey.setState({ user: self });
    await response();
  };

  const responseMocSurveyMobile = async () => {
    if (!self || !self.keyring) return alert("로그인 한 유저만 투표할 수 있습니다.");
    if (!wallet) return alert("해당 컨트랙 네트워크의 지갑을 소유하고 있지 않습니다.");
    await signWalletConnect(wallet.network.provider);
    await response();
  };

  const openDetail = (mocSurvey: gql.MocSurvey) => {
    store.mocSurvey.setState({ isWriteMode: false });
    if (!self) return store.mocSurvey.setState({ mocSurvey });
    const item = self.items.find((item) => item.thing.id === mocSurvey.thing.id);
    if (!item) return store.mocSurvey.setState({ mocSurvey });
    const response = findResponse(mocSurvey.id, self.id);
    store.shared.wallet.setState({ wallet });
    store.mocSurvey.setState({ mocSurvey, ...(response ?? gql.defaultUserSurveyResponse) });
  };

  const closeDetail = () => {
    store.mocSurvey.setState({ ...gql.platform.defaultSurveyResponse, mocSurvey: null, response: null });
    store.shared.network.setState({ network: null });
  };

  const activeMocSurveyList = () =>
    mocSurveyList &&
    mocSurveyList.filter(
      (mocSurvey) =>
        (filter === "all" && ["opened", "closed"].includes(mocSurvey.status)) ||
        (filter === "active" && utils.checkIsActiveSurvey(mocSurvey))
    );

  return {
    self,
    type,
    title,
    wallet,
    openAt,
    closeAt,
    filter,
    maxDay,
    mocSurvey,
    mocSurveyList,
    isWriteMode,
    description,
    answer,
    selection,
    selections,
    today,
    allCount,
    activeCount,
    hasMmoc,
    create,
    creatable,
    isVoted,
    activeMocSurveyList,
    responseMocSurvey,
    responseMocSurveyMobile,
    openDetail,
    closeDetail,
    openCreateBox,
    changeFilter,
    closeCreateBox,
    updateObjective,
    removeObjective,
    addObjective,
  };
};
