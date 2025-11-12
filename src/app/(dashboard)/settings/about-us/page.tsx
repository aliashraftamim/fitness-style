"use client";

import QuillTextEditor from "@/app/_components/QuillTextEditor/QuillTextEditor";
import {
  useGetAboutQuery,
  useUpdateAboutUsMutation,
} from "@/redux/features/pat/pat.api";

import { useEffect, useState } from "react";

const AboutUsPage = () => {
  const { data: about, isLoading } = useGetAboutQuery(undefined);
  const [quillData, setQuillData] = useState("");

  useEffect(() => {
    if (about?.success && about?.data?.body) {
      setQuillData(about.data.body);
    }
  }, [about, isLoading]);

  const [updatePrivacy] = useUpdateAboutUsMutation();

  return (
    <>
      <QuillTextEditor
        title="About Us"
        quillData={quillData}
        setQuillData={setQuillData}
        updateTextIntoDB={updatePrivacy}
      />
    </>
  );
};

export default AboutUsPage;
