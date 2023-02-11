import { useState, useRef } from "react";
import axios from "../../api/axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAppSelector } from "../../redux/store/hooks";
import { toast } from "react-toastify";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import {
  PlusCircleIcon,
  TrashIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Overlay from "../Modals/Overlay";
import DotContainer from "../DotContainer";
import { motion } from "framer-motion";

interface Props {
  text: string;
  galleryContainerId: string;
}

const GalleryContainer: React.FC<Props> = ({ text, galleryContainerId }) => {
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [galleryTitle, setGalleryTitle] = useState<string>(text || "");
  const queryClient = useQueryClient();
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const imagesQuery = useQuery(
    ["gallery-images-query", galleryContainerId],
    async () => {
      const res = await axios.get(
        `/gallery/${galleryContainerId}/gallery-images`
      );
      return res;
    }
  );

  const updateGalleryTitleMutation = useMutation(
    async (payload: any) => {
      const res = await axios.patch(
        `/gallery/${galleryContainerId}/update-gallery-title`,
        payload
      );
      return res;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        if (data.status === 200) {
          queryClient.invalidateQueries("gallery-container-query");
          setEditMode(false);
          toast(data?.data?.message);
        }
      },
    }
  );
  const uploadImageMutation = useMutation(
    async (payload: any) => {
      const res = await axios.post(
        `/gallery/${workspaceId}/${galleryContainerId}/upload-image`,
        payload
      );

      return res;
    },
    {
      onError: (error) => {},
      onSuccess: (data) => {
        if (data.status === 201) {
          toast("Image Upload SuccessFully!!");
          queryClient.invalidateQueries([
            "gallery-images-query",
            galleryContainerId,
          ]);
        }
      },
    }
  );

  const deleteGalleryContainerMutation = useMutation(
    async (deleteGalleryContainerId: string) => {
      const res = await axios.delete(
        `/gallery/${deleteGalleryContainerId}/delete-gallery-container`
      );
      return res;
    },
    {
      onError: (data) => {
        console.log("error", data);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries("gallery-container-query");
        toast(data?.data?.message);
      },
    }
  );

  const deletePhotoMutation = useMutation(
    async (photoId: string) => {
      const res = await axios.delete(
        `/gallery/${userId}/${photoId}/delete-single-photo`
      );
      return res.data;
    },
    {
      onSuccess(data) {
        queryClient.invalidateQueries([
          "gallery-images-query",
          galleryContainerId,
        ]);
        console.log(data, "data");
      },
      onError(error) {
        console.log(error, "error");
      },
    }
  );

  const handleDeleteGalleryContainer = () => {
    deleteGalleryContainerMutation.mutate(galleryContainerId);
  };

  const handleDeletePhoto = (photoId: string) => {
    deletePhotoMutation.mutate(photoId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (!file) return toast("Please Select an Image ");
    const formData = new FormData();
    formData.append(file.name, file);
    uploadImageMutation.mutate(formData);
  };

  const handleGalleryTitleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!galleryTitle) return toast("Please Fill the Required Field");
    updateGalleryTitleMutation.mutate({ title: galleryTitle });
  };

  function showImage(index: number) {
    setCurrentImageIndex(index);
    setShowViewer(true);
  }

  const imagesData = imagesQuery?.data?.data || [];
  const imagesUrl = imagesData.map((imageData: any) => imageData.url);

  const prevHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex !== 0) {
      setCurrentImageIndex((prevState: number) => prevState - 1);
    }
  };

  const nextHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex !== imagesUrl.length - 1) {
      setCurrentImageIndex((prevState: number) => prevState + 1);
    }
  };

  useOnClickOutside(galleryContainerRef, () => {
    setEditMode(false);
    setGalleryTitle(text);
  });

  return (
    <>
      <div
        ref={galleryContainerRef}
        className="group flex flex-col border-2 p-3 border-custom-light-dark gap-4 rounded-md"
      >
        <div className="flex flex-col gap-4 rounded-md  group">
          <div className="flex text-2xl justify-between items-center">
            {editMode ? (
              <form onSubmit={handleGalleryTitleSubmit}>
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(event) => setGalleryTitle(event.target.value)}
                  className="outline-none bg-custom-light-dark px-2 py-1 text-base rounded-sm text-white"
                />
              </form>
            ) : (
              <div onDoubleClick={() => setEditMode(true)}>{text}</div>
            )}
            <div>
              <button
                className="flex items-center justify-center"
                onClick={handleDeleteGalleryContainer}
              >
                <TrashIcon className="h-5 w-5 hidden hover:text-custom-light-green cursor-pointer text-gray-400 group-hover:flex" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-2 auto-rows-[200px]   grid-cols-responsive-gallery">
          {imagesData.map((imageData: any, index: number) => {
            return (
              <div
                key={imageData.id}
                className="parent relative group rounded-md  cursor-pointer"
              >
                <div
                  onClick={() => handleDeletePhoto(imageData.id)}
                  className="-right-1 child -top-2 hidden  text-gray-400 hover:text-custom-light-green   absolute  items-center justify-center bg-[#333] h-6 w-6 rounded-full"
                >
                  <XCircleIcon className="h-4 w-4" />
                </div>
                <div className="w-full h-full overflow-hidden rounded-md">
                  <img
                    src={imageData.url}
                    alt={imageData.id}
                    onClick={() => showImage(index)}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            );
          })}
          <label className="cursor-pointer flex items-center text-gray-400 hover:text-custom-light-green justify-center bg-custom-light-dark  rounded-md hover:shadow">
            <PlusCircleIcon className="h-12 " />
            <input
              className="w-0 h-0"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      <Overlay isOpen={showViewer} onClick={() => setShowViewer(false)}>
        <div className="flex flex-col gap-3  w-full h-full p-3 pt-12 ">
          <button className="ml-auto block">
            <XCircleIcon className="h-8 w-8 hover:text-custom-light-green text-gray-400" />
          </button>
          <div className="flex items-center justify-center gap-4">
            <button
              className=" w-12 h-12 flex items-center justify-center rounded-full bg-custom-light-dark shadow-lg"
              onClick={prevHandler}
            >
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            </button>
            <div className="w-[70%] h-[30rem]">
              <motion.img
                key={imagesUrl[currentImageIndex]}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full object-contain"
                src={imagesUrl[currentImageIndex]}
                alt="Gallery View"
              />
            </div>
            <button
              className="bg-custom-light-dark w-12 h-12 flex items-center justify-center rounded-full"
              onClick={nextHandler}
            >
              <ChevronRightIcon className="h-5 w-5 text-white" />
            </button>
          </div>
          <DotContainer
            images={imagesUrl}
            current={currentImageIndex}
            onClick={(index: number) => showImage(index)}
          />
        </div>
      </Overlay>
    </>
  );
};

export default GalleryContainer;
