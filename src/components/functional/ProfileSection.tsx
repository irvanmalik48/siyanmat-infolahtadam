"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Field, Form } from "formik";
import { signOut } from "next-auth/react";
import { useStaleWhileRevalidate } from "@/lib/swr";
import { Upload } from "lucide-react";
import { atom, useAtom } from "jotai";
import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import Toast from "./Toast";

interface SafeUser {
  id: string;
  username: string;
  name: string;
  image: string;
  role: string;
}

const roles = {
  superadmin: "Super Administrator",
  admin: "Administrator",
  viewer: "Viewer",
};

const profilePicDialogOpenAtom = atom(false);
const onDragEnterAtom = atom(false);
const onDragLeaveAtom = atom(false);
const onDragOverAtom = atom(false);
const onDropAtom = atom(false);
const onFileChangeAtom = atom(false);
const onSuccessAtom = atom(false);

export default function ProfileSection() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, error, isLoading } = useStaleWhileRevalidate<SafeUser>(
    `/api/users/${session?.user?.email}`,
    {
      fallbackData: {
        id: "",
        username: "Loading...",
        name: "Loading...",
        image: "/placeholder_portrait.png",
        role: "",
      },
    }
  );

  const [_profilePicDialogOpen, setProfilePicDialogOpen] = useAtom(
    profilePicDialogOpenAtom
  );

  const handleDialogOpen = (e: any) => {
    e.preventDefault();
    setProfilePicDialogOpen(true);
  };

  if (isLoading) return <ProfileSectionSkeleton />;
  if (error) return <ProfileSectionError />;

  return (
    <AnimatePresence initial={false}>
      <motion.section
        key="profile-section-main"
        className="flex items-stretch justify-start w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.5,
        }}
      >
        <button
          className="group relative aspect-square w-[200px] overflow-hidden rounded-full border border-neutral-300"
          onClick={handleDialogOpen}
        >
          <img
            src={`/api/images${data?.image}`}
            width={200}
            height={200}
            className="z-0 w-full h-full transition group-hover:brightness-50"
            alt="Profile Picture"
          />
          <div className="absolute inset-0 grid grid-cols-1 gap-2 text-white transition opacity-0 place-content-center group-hover:opacity-100">
            <Upload className="w-8 h-8 mx-auto" />
            <p className="text-sm font-semibold">Ganti foto profil</p>
          </div>
        </button>
        <UploadProfilePicDialog />
        <div className="flex flex-col items-start self-stretch justify-between w-full min-h-full ml-5">
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-2xl font-bold">{data?.name}</h1>
            <h2 className="text-lg font-medium text-neutral-500">
              {data?.username}
            </h2>
          </div>
          <div className="flex items-center justify-end w-full gap-2">
            <button
              className="py-2 font-semibold text-white transition bg-red-700 rounded-full w-fit px-7 hover:bg-red-600"
              onClick={async () => {
                await signOut().then(() => {
                  router.push("/login");
                });
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

function ProfileSectionSkeleton() {
  return (
    <AnimatePresence initial={false}>
      <motion.section
        key="profile-section-skeleton"
        className="flex items-stretch justify-start w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.5,
        }}
      >
        <div className="aspect-square w-[200px] animate-pulse overflow-hidden rounded-full border border-neutral-300" />
        <div className="flex flex-col items-start self-stretch justify-between w-full min-h-full ml-5">
          <div className="flex flex-col items-start justify-start w-full">
            <div className="w-1/2 rounded-full h-7 animate-pulse bg-neutral-300" />
            <div className="w-1/3 h-5 mt-1 rounded-full animate-pulse bg-neutral-300" />
            <div className="flex items-center justify-start gap-2 px-4 py-1 mt-2 border rounded-full border-neutral-300">
              <div className="w-5 h-5 rounded-full animate-pulse bg-neutral-300" />
              <div className="w-24 h-5 rounded-full animate-pulse bg-neutral-300" />
            </div>
          </div>
          <div className="flex items-center justify-end w-full gap-2">
            <div className="w-1/5 h-10 rounded-full animate-pulse bg-neutral-300" />
            <div className="w-1/4 h-10 rounded-full animate-pulse bg-neutral-300" />
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

function ProfileSectionError() {
  return (
    <AnimatePresence>
      <motion.section
        key="profile-section-error"
        className="flex items-stretch justify-start w-full gap-5 p-5 mt-8 border rounded-xl border-neutral-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.5,
        }}
      >
        <div className="aspect-square w-[200px] overflow-hidden rounded-full border border-neutral-300" />
        <div className="flex flex-col items-start self-stretch justify-between w-full min-h-full ml-5">
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-2xl font-bold">Error</h1>
            <h2 className="text-lg font-medium text-neutral-500">Error</h2>
            <div className="flex items-center justify-start gap-2 px-4 py-1 border rounded-full border-neutral-300">
              <p className="text-sm font-semibold">Error</p>
            </div>
          </div>
          <div className="flex items-center justify-end w-full gap-2">
            <p className="py-2 font-semibold text-white transition bg-red-700 rounded-full w-fit px-7 hover:bg-red-600">
              Error
            </p>
            <p className="py-2 font-semibold text-white transition rounded-full w-fit bg-celtic-800 px-7 hover:bg-celtic-700">
              Error
            </p>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

function UploadProfilePicDialog() {
  const [dialogOpen, setDialogOpen] = useAtom(profilePicDialogOpenAtom);
  const { data: session } = useSession();
  const { mutate } = useStaleWhileRevalidate<SafeUser>(
    `/api/users/${session?.user?.email}`
  );

  const [_onDragEnter, setOnDragEnter] = useAtom(onDragEnterAtom);
  const [_onDragLeave, setOnDragLeave] = useAtom(onDragLeaveAtom);
  const [onDragOver, setOnDragOver] = useAtom(onDragOverAtom);
  const [onDrop, setOnDrop] = useAtom(onDropAtom);
  const [onFileChange, setOnFileChange] = useAtom(onFileChangeAtom);

  const [onSuccess, setOnSuccess] = useAtom(onSuccessAtom);

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return {
          ...state,
          inDropZone: action.inDropZone,
        };
      case "ADD_FILE":
        return {
          ...state,
          file: action.file,
        };
      case "RESET_FILE":
        return {
          ...state,
          file: null,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    inDropZone: false,
    file: null,
  });

  useEffect(() => {
    if (!dialogOpen) {
      setOnDragEnter(false);
      setOnDragLeave(false);
      setOnDragOver(false);
      setOnDrop(false);
      setOnFileChange(false);

      dispatch({ type: "RESET_FILE" });
    }
  }, [dialogOpen]);

  const handleClose = (e: any) => {
    e.preventDefault();
    setDialogOpen(false);
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setOnDragEnter(true);
    setOnDragLeave(false);
    setOnDragOver(false);
    setOnDrop(false);
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setOnDragEnter(false);
    setOnDragLeave(true);
    setOnDragOver(false);
    setOnDrop(false);
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setOnDragEnter(false);
    setOnDragLeave(false);
    setOnDragOver(true);
    setOnDrop(false);
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setOnDragEnter(false);
    setOnDragLeave(false);
    setOnDragOver(false);
    setOnDrop(true);

    const file: File = e.dataTransfer.files[0];
    if (file) {
      dispatch({ type: "ADD_FILE", file });
    }

    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  const handleFileChange = (e: any) => {
    const file: File = e.target.files[0];
    if (file) {
      dispatch({ type: "ADD_FILE", file });
      setOnFileChange(true);
    }
  };

  return (
    <>
      <AnimatePresence onExitComplete={() => setOnSuccess(false)}>
        {onSuccess && (
          <Toast
            key="upload-profile-pic-success-toast"
            message="Berhasil mengganti gambar profil!"
            atom={onSuccessAtom}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {dialogOpen && (
          <motion.dialog
            key="upload-profile-pic-dialog"
            className="fixed inset-0 flex items-center justify-center w-full h-full p-5 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex w-full max-w-[500px] flex-col items-center justify-center rounded-2xl bg-white p-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <h1 className="text-2xl font-bold">Upload Gambar Profil</h1>
              <p className="text-sm font-semibold text-neutral-500">
                Upload gambar untuk mengganti gambar profilmu
              </p>
              <Formik
                initialValues={{
                  image: "",
                }}
                onSubmit={async (values) => {
                  const formData = new FormData();
                  formData.append("image", state.file);

                  const res = await fetch("/api/upload?type=user", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();

                  const anotherFormData = new FormData();
                  anotherFormData.append(
                    "email",
                    session?.user?.email as string
                  );
                  anotherFormData.append("image", data.imageUrl);

                  const anotherRes = await fetch("/api/users/upload", {
                    method: "PUT",
                    body: anotherFormData,
                  });

                  const anotherData = await anotherRes.json();

                  await mutate(anotherData, {
                    optimisticData: {
                      ...anotherData,
                      image: data.imageUrl,
                    },
                  });

                  setOnFileChange(false);
                  dispatch({ type: "RESET_FILE" });
                  setOnSuccess(true);
                }}
              >
                {({ isSubmitting }) => (
                  <>
                    <Form className="flex flex-col items-center justify-center w-full gap-5 mt-5">
                      <label
                        className="flex flex-col items-center justify-center w-full gap-2 p-5 transition border cursor-pointer rounded-xl border-neutral-300"
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        style={{
                          backgroundColor: onDragOver
                            ? "rgb(30 86 34 / 100%)"
                            : "transparent",
                          borderColor: onDragOver
                            ? "rgb(30 86 34 / 100%) !important"
                            : "rgb(212 212 212 / 100%)",
                          color: onDragOver ? "white" : "rgb(30 86 34 / 100%)",
                        }}
                      >
                        {(onDrop || onFileChange) && dialogOpen ? (
                          <>
                            <img
                              src={URL.createObjectURL(state.file)}
                              alt="profile-pic"
                              className="w-24 h-24 rounded-lg"
                            />
                            <p className="px-5 py-2 mt-2 overflow-hidden truncate rounded-full max-w-48 bg-celtic-800 bg-opacity-10">
                              {state.file.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8" />
                            <p className="text-sm font-semibold">
                              {onDragOver
                                ? "Lepas gambar anda disini"
                                : "Tarik atau klik untuk mengunggah gambar"}
                            </p>
                          </>
                        )}
                        <Field
                          name="image"
                          type="file"
                          className="hidden"
                          onChange={(e: any) => {
                            handleFileChange(e);
                          }}
                        />
                      </label>
                      <div className="flex items-center justify-center gap-2 mx-auto">
                        <button
                          className="py-2 font-semibold text-white transition bg-red-700 rounded-full w-fit px-7 hover:bg-red-600 disabled:brightness-50"
                          disabled={isSubmitting}
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2 font-semibold text-white transition rounded-full w-fit bg-celtic-800 px-7 hover:bg-celtic-700 disabled:brightness-50"
                          disabled={isSubmitting}
                          onClick={() => {
                            const timer = setTimeout(() => {
                              setDialogOpen(false);
                              clearTimeout(timer);
                            }, 50);
                          }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </Form>
                  </>
                )}
              </Formik>
            </motion.div>
          </motion.dialog>
        )}
      </AnimatePresence>
    </>
  );
}
