import React, { useEffect, useRef, useState } from "react";

// features
import {
  useAddNewPostMutation,
  useUpdatePostMutation,
} from "../../../app/features/post/postSlice";

// Components
import { CustomInput, CustomButton, FormLoader } from "../../index";

// Styles
import style from "./Post.module.css";
import { toast } from "react-toastify";
import { closeModal } from "../../../app/features/modal/modalSlice";
import { useDispatch } from "react-redux";
import { Photo } from "../../../svg";
import styleIcons from "../../../styles/icons.module.css";
const AddEditPost = ({ post, user }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ text: "", image: "" });
  console.log("🚀 ~ file: index.js:22 ~ AddEditPost ~ form:", form);
  const [error, setError] = useState(null);
  const [picture, setPicture] = useState(null);
  const [showOldCover, setShowOldCover] = useState(false);
  const refImageInput = useRef(null);
  const [showImageContainer, setShowImageContainer] = useState(false);
  const id = form._id || null;
  const [addNewPost, { isLoading, isError, isSuccess }] =
    useAddNewPostMutation();
  const [
    updatePost,
    {
      isLoading: updateIsLoading,
      isError: updateError,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdatePostMutation();

  useEffect(() => {
    if (isError || updateError) {
      setError("something went wrong");
    }

    if (isSuccess || updateIsSuccess) {
      clear();
      dispatch(closeModal());
    }
    toast.error(error, {
      position: toast.POSITION.TOP_CENTER,
    });
  }, [isSuccess, updateIsSuccess, isError, updateError, error, dispatch]);

  //displaying picture after upload handler
  const onChangePicture = (e) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
  };

  //handling the memorie old fields for the update
  useEffect(() => {
    if (post) setForm({ ...post });
  }, [post]);

  //clearing the state for the newest user inputs
  const clear = () => {
    setForm({ text: "", image: "" });
  };
  const clearImage = () => {
    setForm({ image: null });
  };

  //onChangeHandler
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  //onChangefile
  const onChangefile = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/jpg"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    }
    setForm({
      ...form,
      [e.target.name]: file,
    });
    setError(null);
  };

  //onsubmitHandler
  const onsubmitHandler = async (event) => {
    event.preventDefault();
    let dataForm = new FormData();
    dataForm.append("text", form.text);
    dataForm.append("image", form.image);
    if (Boolean(post)) {
      await updatePost({ id, dataForm });
    } else {
      await addNewPost(dataForm);
    }
  };
  return (
    <div className={style.post_container}>
      <FormLoader loading={updateIsLoading || isLoading}>
        <div className={style.post_head}>
          <span>{post ? "Update your " : "Create "}post</span>
        </div>
        {/* <div className={style.splitter} /> */}

        <div className={style.post_auther}>
          <img
            src={user.photo}
            alt="userphoto"
            className={style.auther_photo}
          />
          <span className={style.auther_name}>
            {`${user.firstName} ${user.lastName}`}
          </span>
        </div>
        <div className={style.post_content}>
          <CustomInput
            type="textarea"
            placeholder={`What's on your mind, ${user?.firstName}?`}
            name="text"
            onChange={onChangeHandler}
            value={form.text}
            className={style.textarea}
          />

          <div>
            <CustomInput
              type="file"
              innerRef={refImageInput}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                onChangePicture(e);
                onChangefile(e);
              }}
              name="image"
              hidden
            />
            {showImageContainer && (
              <div className={style.post_image_container}>
                {picture ? (
                  <div className={`${style.add_image} ${style.imge}`}>
                    <div
                      className={`${style.exit} ${style.small_white_circle}`}
                      onClick={() => {
                        setShowImageContainer(false);
                        clearImage();
                      }}
                    >
                      <i className={styleIcons.exit_icon} />
                    </div>
                    <img
                      id="output"
                      src={picture && picture}
                      alt="your_image"
                      className={style.img}
                    />
                  </div>
                ) : (
                  <div className={`${style.add_image} hover2`}>
                    <div
                      className={`${style.exit} ${style.small_white_circle}`}
                      onClick={() => setShowImageContainer(false)}
                    >
                      <i className={styleIcons.exit_icon} />
                    </div>
                    <div>
                      <CustomButton
                        className={style.post_btn}
                        onClick={() => {
                          refImageInput.current.click();
                        }}
                      >
                        <i className={styleIcons.addPhoto_icon} />
                        Add A photo
                      </CustomButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* <CustomButton
            className="button button8"
            value={post ? "update" : "submit"}
            type="submit"
            disabled={!form.text || error}
            onClick={() => {onsubmitHandler()}}
          />  */}
        </div>
        {/* <div className={style.splitter} /> */}
      </FormLoader>
      <div className={style.post_footer}>
        <div className={style.footer_text}>Add to your post</div>
        <div className="hover1" onClick={() => setShowImageContainer(true)}>
          <Photo color="#45bd62" />
        </div>
      </div>
    </div>
  );
};

export default AddEditPost;
