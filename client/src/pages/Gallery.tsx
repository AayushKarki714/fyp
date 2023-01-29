import React, { useRef, useState } from "react";
import {
  PlusCircleIcon,
  FolderPlusIcon,
  TrashIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import CreateGallery from "../components/Modals/CreateGallery";
import Overlay from "../components/Modals/Overlay";
import Modal from "../components/Modals/Modal";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useQueryClient, useMutation, useQuery } from "react-query";
import axios from "../api/axios";
import { useAppSelector } from "../redux/store/hooks";
import useOnClickOutside from "../hooks/useOnClickOutside";
import DotContainer from "../components/DotContainer";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface GalleryContainerProps {
  text: string;
  galleryContainerId: string;
}

const GalleryContainer: React.FC<GalleryContainerProps> = ({
  text,
  galleryContainerId,
}) => {
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [galleryTitle, setGalleryTitle] = useState<string>(text || "");
  const queryClient = useQueryClient();
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
  const handleDeleteGalleryContainer = () => {
    deleteGalleryContainerMutation.mutate(galleryContainerId);
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
                <TrashIcon className="h-4 w-4 hidden hover:text-custom-light-green cursor-pointer text-gray-400 group-hover:flex" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-2 auto-rows-[200px] grid-cols-responsive-gallery">
          {imagesData.map((imageData: any, index: number) => {
            return (
              <div
                key={imageData.id}
                className="rounded-md overflow-hidden cursor-pointer"
              >
                <img
                  src={imageData.url}
                  alt={imageData.id}
                  onClick={() => showImage(index)}
                  className="object-cover w-full h-full"
                />
              </div>
            );
          })}
          <label className="cursor-pointer flex items-center justify-center bg-custom-light-dark group rounded-md hover:shadow">
            <PlusCircleIcon className="h-12 text-gray-400 group-hover:text-custom-light-green" />
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

const Gallery: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const galleryContainerMutation = useMutation(
    async (payload: any) => {
      const res = await axios.post(
        `/gallery/${workspaceId}/create-gallery-container`,
        payload
      );
      return res;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
        console.log("error", error);
      },
      onSuccess: (data) => {
        if (data.status === 201) {
          setIsOpen(false);
          queryClient.invalidateQueries("gallery-container-query");
          toast(
            `${data?.data?.title} Gallery Container Was SucessFully Created`
          );
        }
      },
    }
  );

  const galleryContainerQuery = useQuery(
    "gallery-container-query",
    async () => {
      const res = await axios.get(`/gallery/${workspaceId}/gallery-container`);
      return res;
    },
    {
      cacheTime: 100,
    }
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  useNavigateToDashboard();

  const handleOnCreateGalleryContainer = (title: string) => {
    const payload = { title, workspaceId };
    galleryContainerMutation.mutate(payload);
  };

  if (galleryContainerQuery.isLoading) {
    return (
      <div className="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 w-full bg-black opacity-80 h-full">
        <p>Loading....</p>
      </div>
    );
  }

  const galleryContainerData = galleryContainerQuery.data?.data || [];

  return (
    <>
      <div className="flex flex-col gap-3  h-full">
        <button
          className="flex items-center justify-center p-2 w-10 h-10 rounded-full ml-auto text-gray-400 hover:text-custom-light-green"
          onClick={() => setIsOpen(true)}
        >
          <FolderPlusIcon className="h-6" />
        </button>
        <Overlay isOpen={isOpen} onClick={closeModal}>
          <Modal onClick={closeModal}>
            <CreateGallery
              onSubmit={(title: string) =>
                handleOnCreateGalleryContainer(title)
              }
            />
          </Modal>
        </Overlay>
        {galleryContainerData.length > 0 ? (
          <div className="flex flex-col gap-4">
            {galleryContainerData.map((galleryContainer: any) => {
              return (
                <GalleryContainer
                  key={galleryContainer.id}
                  galleryContainerId={galleryContainer.id}
                  text={galleryContainer.title}
                />
              );
            })}
          </div>
        ) : (
          <p className="mt-28 text-gray-400 text-center">
            Empty Gallery Container
          </p>
        )}
      </div>
    </>
  );
};

export default Gallery;
