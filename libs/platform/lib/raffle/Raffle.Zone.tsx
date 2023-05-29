"use client";
import * as Raffle from "./_client";
import { DataEditModal, DataListContainer, Input, LoadUnits, LoadView } from "@shared/client";
import { ModelsProps, ServerInit, ServerView, Utils, useInterval } from "@util/client";
import { fetch, st } from "@platform/client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export const Admin = ({ sliceName = "raffle", init }: ModelsProps<fetch.Raffle>) => {
  return (
    <DataListContainer
      init={{
        ...init,
        default: {
          priceTags: [{}],
          announceAt: dayjs(new Date()).add(3),
          closeAt: dayjs(new Date()).add(1),
        } as any,
      }}
      sliceName={sliceName}
      // type="card"
      renderItem={Raffle.Unit.Admin}
      renderDashboard={Raffle.Util.Stat}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(raffle: fetch.Raffle) => `${raffle.getName()}`}>
          <Raffle.Edit.General />
        </DataEditModal>
      }
      columns={["type", "entryLimit", "closeAt", "announceAt"]}
      actions={(raffle: fetch.LightRaffle, idx) => ["remove", "edit"]}
    />
  );
};
interface SelfProps {
  className?: string;
  init: ServerInit<"raffle", fetch.LightRaffle>;
}
export const Self = ({ className, init }: SelfProps) => {
  const [renderer, setRenderer] = useState(0);
  useInterval(() => {
    setRenderer(renderer + 1);
    if (renderer > 10) setRenderer(0);
  }, 1000);
  return (
    <LoadUnits
      className={className}
      init={init}
      renderItem={(raffle) => (
        <button onClick={() => st.do.viewRaffle(raffle.id, { modal: `view-${raffle.id}` })}>
          <Raffle.Unit.Self raffle={raffle} />
        </button>
      )}
    />
  );
};

interface SelfViewProps {
  className?: string;
  view: ServerView<"raffle", fetch.Raffle>;
  userId?: string;
}
export const SelfView = ({ className, view, userId }: SelfViewProps) => {
  return (
    <LoadView
      className={className}
      view={view}
      renderView={(raffle) => <Raffle.View.Self userId={userId} raffle={raffle} />}
    />
  );
};

interface ViewModalProps {
  className?: string;
  money?: string;
  userId?: string;
}
export const ViewModal = ({ className, money, userId }: ViewModalProps) => {
  const self = (st.use as any).self();
  const raffle = st.use.raffle();
  const shipInfoForm = st.use.shipInfoForm();
  useEffect(() => {
    console.log(raffle);
    if (raffle === "loading") return;
    if (userId && self?.id && raffle.status === "closed" && raffle.isPicked(userId))
      st.do.openMyShipInfo(self, raffle.product as fetch.shared.Product);
    else {
      console.log(userId, self?.id, raffle.status === "closed", raffle.isPicked(userId), raffle);
      st.do.newShipInfo({ user: self, product: raffle.product as fetch.shared.Product });
    }
    // userId && self?.id && raffle.status === "closed" && raffle.isPicked(userId)
    //   ? st.do.openMyShipInfo(self, raffle.product as fetch.shared.Product)
    //   : st.do.newShipInfo({ user: self, product: raffle.product as fetch.shared.Product });
  }, [raffle]);
  if (raffle === "loading") return <></>;
  return (
    <div>
      <Raffle.View.Self raffle={raffle} userId={userId} />
      <div className="mx-2">
        {raffle.status !== "closed" ? (
          <div className="items-center justify-center p-[30px]">
            <ul className="list-disc marker:text-black ">
              <li className=" text-[18px] font-bold text-black">
                유의 사항
                <ul className="list-disc ml-[20px] font-normal marker:text-black ">
                  <li className="text-black ">본 이벤트는 앱 전용 이벤트입니다.</li>
                  <li className="text-black ">본인 인증을 한 회원만 응모 가능합니다.</li>
                  <li className="text-black ">사이즈는 랜덤으로 지급되며, 교환 및 환불이 불가능 합니다.</li>
                  <li className="text-black ">
                    당첨자에 한하여 개별 메세지를 발송 드리며, 미당첨자에게는 별도의 연락을 드리지 않습니다.
                  </li>
                  <li className="text-black ">
                    당첨자에게 서류 요청 후, 72시간 내에 회신이 없으면 당첨이 자동 취소되어, 후 순위 당첨자로 변경될 수
                    있습니다.
                  </li>
                  <li className="text-black ">
                    회원정보가 일치하지 않거나, 부당한 방법으로 응모한 고객의 경우 응모취소 및 추후 이벤트 응모 시
                    불이익을 받을 수 있습니다.
                  </li>
                </ul>
              </li>
            </ul>
            {raffle.status !== "raffled" && userId && raffle.entryNum(userId) && (
              <>
                <div className="font-bold text-[20px] mt-5 text-center text-black">{`현재 ${raffle.entryNum(
                  userId
                )}번 중복 참여 중!`}</div>

                <div className="mt-1 text-center text-red-500">중복 참여시 당첨 확률이 올라가요!</div>
              </>
            )}
          </div>
        ) : (
          <div>
            {raffle.isPicked(userId) && (
              <div className="px-10">
                <div>
                  이름
                  <Input
                    className="w-full"
                    inputClassName="w-full"
                    value={shipInfoForm.name}
                    onChange={(e) => st.do.setNameOnShipInfo(e.target.value)}
                  />
                </div>
                <div>
                  주소
                  <Input
                    className="w-full"
                    inputClassName="w-full"
                    value={shipInfoForm.address}
                    onChange={(e) => st.do.setAddressOnShipInfo(e.target.value)}
                  />
                </div>
                <div>
                  전화번호
                  <Input
                    className="w-full"
                    inputClassName="w-full"
                    value={shipInfoForm.phone}
                    maxLength={13}
                    onChange={(e) => st.do.setPhoneOnShipInfo(Utils.formatPhone(e.target.value))}
                  />
                </div>
                <Raffle.Util.Submit
                  disabled={!shipInfoForm.address || !shipInfoForm.name || !Utils.isPhoneNumber(shipInfoForm.phone)}
                  raffleId={raffle.id}
                />
              </div>
            )}
          </div>
        )}
        {raffle.status === "raffling" && <Raffle.Util.Request id={raffle.id} />}
      </div>
    </div>
  );
};
