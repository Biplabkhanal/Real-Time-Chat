import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useRef, useEffect } from "react";

export default function UpdateAvatarForm({ className = "" }) {
    const user = usePage().props.auth.user;
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isNewAvatar, setIsNewAvatar] = useState(false);
    const photoInput = useRef(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            avatar: null,
        });

    const submitAvatar = (e) => {
        e.preventDefault();
        post(route("profile.avatar"), {
            preserveScroll: true,
            onSuccess: () => {
                photoInput.current.value = "";
                setPhotoPreview(null);
            },
        });
    };

    const selectNewPhoto = () => {
        photoInput.current.click();
    };

    const updatePhotoPreview = () => {
        const photo = photoInput.current.files[0];
        if (!photo) return;

        setData("avatar", photo);
        setIsNewAvatar(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(photo);
    };

    useEffect(() => {
        if (recentlySuccessful) {
            setIsNewAvatar(false);
        }
    }, [recentlySuccessful]);

    return (
        <section
            className={`${className} p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
        >
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Picture
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your profile photo
                </p>
            </header>

            <form onSubmit={submitAvatar} className="mt-6 space-y-6">
                <div className="p-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg border border-gray-300 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="mb-4 md:mb-0">
                            {photoPreview ? (
                                <div className="relative h-24 w-24">
                                    <img
                                        src={photoPreview}
                                        className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                                        alt="Photo Preview"
                                    />
                                </div>
                            ) : user.avatar ? (
                                <div className="relative h-24 w-24">
                                    <img
                                        src={`/storage/${user.avatar}`}
                                        className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                                        alt={user.name}
                                    />
                                </div>
                            ) : (
                                <div className="h-24 w-24 rounded-full flex items-center justify-center bg-blue-500 text-white text-3xl font-semibold border-4 border-gray-200 dark:border-gray-700">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <PrimaryButton
                                type="button"
                                onClick={selectNewPhoto}
                            >
                                Select A New Profile Photo
                            </PrimaryButton>
                        </div>
                        {data.avatar && (
                            <PrimaryButton
                                disabled={processing || !isNewAvatar}
                                className={`bg-gradient-to-r ${
                                    isNewAvatar
                                        ? "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                                        : "from-gray-400 to-gray-500 cursor-not-allowed"
                                } transition-all duration-200`}
                            >
                                {isNewAvatar ? "Save" : "Saved"}
                            </PrimaryButton>
                        )}
                    </div>
                </div>

                <div className="mt-2" style={{ display: "none" }}>
                    <InputLabel
                        htmlFor="avatar"
                        value="Photo"
                        className="sr-only"
                    />
                    <input
                        id="avatar"
                        ref={photoInput}
                        type="file"
                        name="avatar"
                        accept="image/*"
                        className="mt-1 block w-full"
                        onChange={updatePhotoPreview}
                    />
                    <InputError message={errors.avatar} className="mt-2" />
                </div>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-green-600 dark:text-green-400">
                        Avatar updated successfully.
                    </p>
                </Transition>
            </form>
        </section>
    );
}
