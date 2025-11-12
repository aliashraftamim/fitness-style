"use client";

import QuillTextEditor from "@/app/_components/QuillTextEditor/QuillTextEditor";
import {
  useGetTermsQuery,
  useUpdateTermsMutation,
} from "@/redux/features/pat/pat.api";
import { useEffect, useState } from "react";

const TermsCondition = () => {
  const { data: quillDataText, isLoading } = useGetTermsQuery(undefined);
  const [quillData, setQuillData] = useState("");
  const [updateTerms] = useUpdateTermsMutation();

  useEffect(() => {
    if (quillDataText?.success && quillDataText?.data?.body) {
      setQuillData(quillDataText.data.body);
    }
  }, [quillDataText, isLoading]);

  if (isLoading) return <p>Loading Terms & Conditions...</p>;

  return (
    <>
      <QuillTextEditor
        title="Terms & Conditions"
        quillData={quillData}
        setQuillData={setQuillData}
        updateTextIntoDB={updateTerms}
      />
    </>
  );
};

export default TermsCondition;
