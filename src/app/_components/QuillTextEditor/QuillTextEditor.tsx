"use client";
import { Button } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
// import ReactQuill from 'react-quill-new';
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import "./Quill.style.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QuillTextEditor = ({
  title,
  quillData,
  setQuillData,
  updateTextIntoDB,
}: {
  title: string;
  quillData: string;
  setQuillData: any;
  updateTextIntoDB: any;
}) => {
  const toolbarOptions = [
    ["image"],
    [{ header: "1" }, { header: "2" }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
  ];

  const moduleContest = {
    toolbar: toolbarOptions,
  };

  const handleEditorChange = (content: string) => {
    setQuillData(content);
  };
  const handleSave = async () => {
    try {
      // Ensure that quillData is updated in state
      setQuillData(quillData);
      const res = await updateTextIntoDB({ body: quillData });

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Updated successful");
      }
    } catch (error) {
      console.error("Error updating privacy policy:", error);
    }
  };

  return (
    <div className="p-2 rounded-lg !bg-transparent h-[85vh] !pt-10">
      <span className="flex items-center gap-3 text-[#333333]">
        <Link href="/settings">
          <HiOutlineArrowSmLeft
            color="#333333"
            className="hover:cursor-pointer"
            size={30}
          />
        </Link>
        <h2 className="font-medium">{title}</h2>
      </span>
      <ReactQuill
        modules={moduleContest}
        theme="snow"
        value={quillData}
        onChange={handleEditorChange}
        placeholder="Start writing ......"
      />
      <Button
        size="large"
        onClick={() => handleSave()}
        block
        className="mt-[20px] !bg-brand-primary !text-white border-none rounded-md h-[56px] hover:!bg-green-900"
      >
        Update
      </Button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(QuillTextEditor), {
  ssr: false,
});
