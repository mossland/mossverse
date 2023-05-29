import { st, usePage } from "@platform/client";

interface GeneralProps {
  snapshotId?: string | null;
  sliceName?: string;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ sliceName = "snapshot", snapshotId = undefined }: GeneralProps) => {
  const snapshotForm = st.use.snapshotForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">{l("snapshot.field")}</p>
      <input
        className="w-full input input-bordered"
        value={snapshotForm.field}
        onChange={(e) => st.do.setFieldOnSnapshot(e.target.value)}
      />
    </div>
  );
};
