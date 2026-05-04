import React from 'react';
import FormLayout, { InputField } from '../../components/forms/FormLayout';
import { firebaseService } from '../../services/firebaseService';

export default function StaffJobApplication() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await firebaseService.submitForm('staffApplications', data);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout 
      title="Staff Job Application" 
      subtitle="Join the CMTD Training & Management Workforce"
      onSubmit={handleSubmit}
      isLoading={loading}
      isSuccess={success}
    >
      <InputField label="Full Name" name="name" />
      <InputField label="Mobile Number" name="mobile" type="tel" />
      <InputField label="Email" name="email" type="email" />
      <InputField label="School Name" name="schoolName" />
      <InputField label="College Name" name="collegeName" />
      <InputField label="Parent Name" name="parentName" />
      <InputField label="DOB" name="dob" type="date" />
      <InputField 
        label="Post Applied For" 
        name="post" 
        type="select" 
        options={[
          "CMTD Staff", 
          "Drill Incharge", 
          "Education Incharge", 
          "Field Staff", 
          "Training Coordinator", 
          "Assistant Training Officer", 
          "Training Officer", 
          "Team Leader", 
          "Group Leader", 
          "Training Incharge", 
          "Captain Trainer", 
          "Director", 
          "Senior Trainer", 
          "Master Trainer",
          "Management"
        ]} 
      />
      <InputField label="Education Qualification" name="qualification" />
      <InputField label="NCC Certificate (A/B/C)" name="nccCert" />
      <div className="md:col-span-2">
        <InputField label="Full Address" name="address" />
      </div>
    </FormLayout>
  );
}
