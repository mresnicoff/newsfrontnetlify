import { Button, IconButton, Input } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { ImageFill } from "react-bootstrap-icons";
import Modal from "../Components/Modal";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from "../nodes/ImageNode";
import { $insertNodes } from "lexical";
import axios from "axios";
import { ChangeEvent } from 'react'
export interface CloudinaryResponse {
  secure_url: string;
}
export default function ImagePlugin() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);
  
      try {
        const response = await axios.post<CloudinaryResponse>(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        
        if (response.data && response.data.secure_url) {
          console.log(response.data.secure_url);
          // Asegúrate de que setURL esté tipado correctamente en tu componente
          setURL(response.data.secure_url);
        } else {
          console.error('La respuesta de Cloudinary no contiene una URL segura.');
        }
      } catch (error) {
        console.error('Error subiendo la imagen a Cloudinary:', error);
      }
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [url, setURL] = useState("");
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [editor] = useLexicalComposerContext();

  const onAddImage = () => {
    let src = "";
    if (url) src = url;
    if (file) src = URL.createObjectURL(file);

    editor.update(() => {
      const node = $createImageNode({ src, altText: "Dummy text" });
      $insertNodes([node]);
    });
    setFile(undefined);
    setURL("");
    setIsOpen(false);
  };

  return (
    <div>
      <IconButton
        icon={<ImageFill />}
        aria-label="Add Image"
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={onChange}
      />
      {isOpen && (
        <Modal
          title="Add Image"
          onClose={() => setIsOpen(false)}
          footer={
            <Button
              variant="ghost"
              isDisabled={!url && !file}
              onClick={onAddImage}
            >
              Add Image
            </Button>
          }
          isOpen={isOpen}
        >
          <Input
            value={url}
            onChange={(e) => setURL(e.target.value)}
            placeholder="Add Image URL"
          />
          <Button
            variant="ghost"
            mt={4}
            onClick={() => inputRef?.current?.click()}
          >
            {file ? file.name : "Upload Image"}
          </Button>
        </Modal>
      )}
    </div>
  );
}
