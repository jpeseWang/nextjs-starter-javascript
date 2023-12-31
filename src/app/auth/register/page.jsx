"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import ConfirmationModal from "./Modal/ConfirmationModal";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const Register = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [capcha, setCapcha] = useState();
  const [email, setEmail] = useState();
  const [avatarUrl, setAvatarUrl] = useState();

  const form = useRef();
  const submitButtonRef = useRef();
  const [error, setError] = useState(null);
  const [samePass, setSamePass] = useState(false);
  const [previewImg, setPreviewImg] = useState();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error2, isLoading } = useSWR("/api/auth/user", fetcher);
  const userList = [];
  data?.forEach((user) => {
    if (user.email) {
      userList.push(user.email);
    }
  });

  useEffect(() => {
    setCapcha(generateCapcha());
  }, []);
  function closeModal() {
    setIsOpen(false);
  }
  const generateCapcha = () => {
    return Math.floor(Math.random() * 100000 + 1);
  };

  const generate = async () => {
    if (!email) {
      setError("Please fill all information before submit!");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } else if (userList.includes(email)) {
      toast.error("Email has been already registered, please try another one!");
    } else {
      await emailjs
        .sendForm(
          "service_u2abmk7",
          "template_dbv1sen",
          form.current,
          "ZVPcFcyh2dGWZShlU"
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
      setIsOpen(true);
    }
  };

  const handlePreviewImage = (e) => {
    const selectedFile = e.target.files[0];
    selectedFile.preview = URL.createObjectURL(selectedFile);
    setPreviewImg(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", previewImg);
      formData.append("upload_preset", "user_avatar");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfdkflzjs/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setAvatarUrl(data.secure_url);

      const fullname = e.target[1].value;
      const username = e.target[2].value;
      const email = e.target[3].value;
      const dob = e.target[4].value;
      const career = e.target[5].value;
      const phone = e.target[6].value;
      const password = e.target[7].value;

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            avatar: data.secure_url,
            fullname,
            username,
            email,
            dob,
            career,
            phone,
            password,
            subscription: "Basic",
          }),
        });
        toast.success("Create account successfully!");
        res.status === 201 &&
          router.push("/auth/login?success=Account has been created");
      } catch (err) {
        setError(err);
        setUploading(false);
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      previewImg && URL.revokeObjectURL(previewImg.preview);
    };
  }, [previewImg]);

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit} ref={form}>
            <input className="hidden" name="capcha" value={capcha} required />
            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Avatar
              </label>
              <div className="mt-2 block items-center gap-x-3">
                {previewImg ? (
                  <img
                    src={previewImg.preview}
                    className="h-20 w-20 rounded-full my-2"
                  />
                ) : (
                  <UserCircleIcon
                    className="h-20 w-20 text-gray-300"
                    aria-hidden="true"
                  />
                )}

                <input
                  type="file"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onChange={handlePreviewImage}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Ex: Leif Le"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Ex: user1_example"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Ex: user@gmail.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date of Birth
              </label>
              <div className="mt-2">
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="career"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Career (Developer, Designer,...)
              </label>
              <div className="mt-2">
                <input
                  id="career"
                  name="career"
                  type="text"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Ex: Student"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Ex: (+84) 123456789"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="px-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {samePass && (
                <p className="text-red-500 font-medium text-sm py-1">
                  Password is not matched!
                </p>
              )}
            </div> */}

            <div>
              <button className="hidden" type="submit" ref={submitButtonRef}>
                sign up trick
              </button>
              <button
                type="submit"
                className="rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full relative"
                disabled={uploading}
                onClick={async (e) => {
                  e.preventDefault();
                  await generate();
                }}
              >
                <div className="flex items-center justify-center">
                  {uploading && (
                    <>
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        spin
                        className="text-indigo-500 h-5 w-5 mr-2"
                      />
                    </>
                  )}
                  Register
                </div>
              </button>
              <p className="my-2 text-red-500 font-medium"> {error && error}</p>
            </div>
          </form>

          <p className="mt-20 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              className="ml-2 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20"
              href="/auth/login"
            >
              <span>
                Get access <span aria-hidden="true">→</span>
              </span>
            </Link>
          </p>
        </div>
      </div>
      {modalIsOpen && (
        <ConfirmationModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          code={capcha}
          email={email}
          submitButtonRef={submitButtonRef}
        />
      )}
    </div>
  );
};

export default Register;
