"use client";

import QuillTextEditor from "@/app/_components/QuillTextEditor/QuillTextEditor";
import {
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
} from "@/redux/features/pat/pat.api";
import { useEffect, useState } from "react";

const PrivacyPolicyPage = () => {
  const { data: privacy, isLoading } = useGetPrivacyQuery(undefined);
  const [quillData, setQuillData] = useState("");

  useEffect(() => {
    if (privacy?.success && privacy?.data?.body) {
      setQuillData(privacy.data.body);
    }
  }, [privacy, isLoading]);

  const [updatePrivacy] = useUpdatePrivacyMutation();

  return (
    <>
      <QuillTextEditor
        title="Privacy Policy"
        quillData={quillData}
        setQuillData={setQuillData}
        updateTextIntoDB={updatePrivacy}
      />
    </>
  );
};

export default PrivacyPolicyPage;
