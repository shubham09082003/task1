import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

function FileUploadModal() {
  const [files, setFiles] = useState<File[]>([]);
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const userId = session?.user.id;
  const [isUploading, setIsUploading] = useState(false);
  const [textContent, setTextContent] = useState<string>("");

  useEffect (() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(file)]);
    }
  };

  const convertPdfToText = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + " ";
      }
      setTextContent(text);
    };
    reader.readAsArrayBuffer(file);
  };

  const convertDocxToText = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const arrayBuffer = this.result as ArrayBuffer;
      const result = await mammoth.extractRawText({ arrayBuffer });
      setTextContent(result.value);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
    setIsUploading(true);
    const fileUpload = async () => {
      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("files")
          .upload(`${userId}/${file.name}`, file);
        if (error) {
          alert(error.message);
        }
        if (data) {
          if (file.type === "application/pdf") {
            await convertPdfToText(file);
          } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            await convertDocxToText(file);
          }
        }
      }
    };
    fileUpload().then(() => {
      alert("File uploaded successfully");
      setFiles([]);
      setIsUploading(false);
    });
  };

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/login");
    }
    catch(err){
      console.log(err);
    }
  }

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
        {textContent && (
          <div className="mt-4 p-4 border rounded">
            <h2 className="text-xl font-bold">Extracted Text</h2>
            <p>{textContent}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploadModal;