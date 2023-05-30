"use client";
import { DataEditModal, Image, Input } from "@shared/client";
import { Utils } from "@util/client";
import { fetch, st } from "@mossland/client";
import { useEffect } from "react";

interface GeneralProps {
  stakePoolId?: string | null;
  sliceName?: string;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
// export const General = ({ sliceName = "stakePool", stakePoolId = undefined }: GeneralProps) => {
//   const stakePoolForm = st.use.stakePoolForm();
//   const { l } = usePage();
//   return (
//     <>
//       <div>
//         <p className="w-20 mt-3">{l("stakePool.type")}</p>
//         <Select value={stakePoolForm.type} onChange={(value) => st.do.setTypeOnStakePool(value)}>
//           {cnst.stakePoolTypes.map((type) => (
//             <Select.Option key={type} value={type}>
//               {type}
//             </Select.Option>
//           ))}
//         </Select>
//       </div>
//       <div>
//         <div>{l("stakePool.thing")}</div>
//         <Field.Parent
//           sliceName={"thing"}
//           renderOption={(thing: fetch.shared.LightThing) => thing.name}
//           value={stakePoolForm.thing}
//           init={{
//             query: {
//               purpose: "money",
//             },
//           }}
//           onChange={(thing: fetch.shared.Thing) => st.do.setThingOnStakePool(thing)}
//         />
//       </div>
//       <div className="flex items-center mb-4">
//         <div className="block">
//           <div>{"center (x, y)"}</div>
//           <Input.Number
//             className="mx-2"
//             value={stakePoolForm.center[0]}
//             onChange={(number) => st.do.setCenterOnStakePool([number, stakePoolForm.center[1]])}
//           />
//           <Input.Number
//             className="mx-2"
//             value={stakePoolForm.center[1]}
//             onChange={(number) => st.do.setCenterOnStakePool([stakePoolForm.center[0], number])}
//           />
//         </div>
//       </div>
//       {/* <Image alt="aa" width={10} height={20} src={"/test1.gif"} /> */}
//       <button onClick={() => st.do.setWhOnStakePool([30, 80])}>add</button>
//     </>
//   );
// };

interface ModalProps {
  sliceName?: string;
}

export const Modal = ({ sliceName = "stakePool" }: ModalProps) => {
  return (
    <DataEditModal
      sliceName={sliceName}
      renderTitle={(stakePool: fetch.LightStakePool) => `StakePool ${stakePool.id}`}
    />
  );
};

export const Staking = () => {
  const stakeValue = st.use.stakeValue();
  const stakeHour = st.use.stakeHour();
  const self = st.use.self();
  const ownershipMap = st.use.ownershipMap();
  const mmoc = ownershipMap === "loading" ? 0 : fetch.shared.Ownership.getValue([...ownershipMap.values()], "MMOC");
  useEffect(() => {
    st.do.initOwnership({ query: { user: self.id, type: "thing" } });
  }, [self]);
  return (
    <div className="justify-around block p-10 md:flex">
      <div className="w-full px-5 mb-5">
        <div className="text-right">예치금액</div>
        <Input
          inputClassName="w-full text-right h-8 min-h-8 focus:border-primary placeholder:text-sm "
          type="number"
          value={stakeValue}
          max={mmoc}
          onChange={(e) => {
            st.do.setStakeValue(
              isNaN(e.target.valueAsNumber) ? 0 : mmoc < e.target.valueAsNumber ? mmoc : Number(e.target.valueAsNumber)
            );
          }}
        />
        <div className="flex justify-end gap-1 mt-1 text-right text-gray-500">
          현재 내 자산:
          <Image src="/images/mm_coin.png" width={20} height={20} />
          {Utils.numberWithCommas(mmoc)}
        </div>
      </div>
      <div className="w-full px-5">
        <div className="text-right">예치기간</div>
        <Input
          type="number"
          max={600}
          inputClassName="w-full text-right h-8 min-h-8 focus:border-primary placeholder:text-sm"
          value={stakeHour}
          onBlur={(e) => 24 > e.target.valueAsNumber && st.do.setStakeHour(24)}
          onChange={(e) =>
            st.do.setStakeHour(
              isNaN(e.target.valueAsNumber) ? 24 : 600 < e.target.valueAsNumber ? 600 : e.target.valueAsNumber
            )
          }
        />
        <div className="text-right text-gray-500">최소 예치 기간 24 hr</div>
        <div className="text-right text-gray-500">현재 최대 예치 기간 600 hr</div>
      </div>
    </div>
  );
};
