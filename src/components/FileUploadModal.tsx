import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function FileUploadModal() {
  const [files, setFiles] = useState<File[]>([]);
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const userId = session?.user.id;
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(file)]);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    const fileUpload = async () => {
      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("files")
          .upload(`${userId}/${file.name}`, file);
        if (error) {
          console.log(error);
        }
        if (data) {
          console.log(data);
        }
      }
    };
    fileUpload().then(() => {
      alert("File uploaded successfully");
      setFiles([]);
      setIsUploading(false);
    });
  };

  if (session === null) return null;

  return (
    <div>
      <div className="flex justify-end mb-4 p-4">
        <Button onClick={handleSignOut} className="bg-black" variant="outline">
          SignOut
        </Button>
      </div>
      <h1 className="text-2xl font-bold p-3 text-center">File Upload</h1>
      <div className="flex flex-col items-center justify-center">
        <Input
          type="file"
          multiple
          className="bg-transparent w-80"
          onChange={handleFileChange}
        />
        <Button className="mt-3" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}

export default FileUploadModal;
