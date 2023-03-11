import React, { useState } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import CreateGallery from "../components/Modals/CreateGallery";
import Overlay from "../components/Modals/Overlay";
import Modal from "../components/Modals/Modal";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useQueryClient, useMutation, useQuery } from "react-query";
import axios from "../api/axios";
import { useAppSelector } from "../redux/store/hooks";
import { toast } from "react-toastify";
import GalleryContainer from "../components/Gallery/GalleryContainer";
import Spinner from "../components/Spinner/Spinner";

const Gallery: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { workspaceId } = useAppSelector((state) => state.workspace);
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const galleryContainerQuery = useQuery(
    "gallery-container-query",
    async () => {
      const res = await axios.get(`/gallery/${workspaceId}/gallery-container`);
      return res;
    },
    {
      enabled: !!workspaceId,
    }
  );

  const galleryContainerMutation = useMutation(
    async (payload: any) => {
      const res = await axios.post(
        `/gallery/${userId}/${workspaceId}/create-gallery-container`,
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

  const closeModal = () => {
    setIsOpen(false);
  };

  useNavigateToDashboard();

  const handleOnCreateGalleryContainer = (title: string) => {
    const payload = { title, workspaceId };
    galleryContainerMutation.mutate(payload);
  };

  if (galleryContainerQuery.isLoading) {
    return <Spinner isLoading={galleryContainerQuery.isLoading} />;
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
                  createdUsername={galleryContainer.user.userName}
                  photo={galleryContainer.user.photo}
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
