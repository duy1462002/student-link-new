import React from "react";
import { ModalHeader, Modal, Form, FormField, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { groupActions } from "../../actions/groupActions";
import toast from "react-hot-toast";
import SpinnerLoading from "../SpinnerLoading";

function EditAboutGroupModal({ currentGroup, dispatch, updating }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    name: currentGroup.name,
    description: currentGroup.description,
    rules: currentGroup.rules,
  });
  const [errors, setErrors] = React.useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const validate = () => {
    let errors = {};
    if (!data.name) {
      errors.name = "Name is required";
    }
    if (!data.description) {
      errors.description = "Description is required";
    }
    if (!data.rules) {
      errors.rules = "Rules are required";
    }
    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) => toast.error(error));
      return;
    }

    setErrors({});
    dispatch(groupActions.updateGroup({ groupId: currentGroup._id, ...data }));
  };

  React.useEffect(() => {
    if (!updating) {
      setOpen(false);
    }
  }, [updating]);

  return (
    <Modal
      closeIcon={false}
      size="small"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <button className="group-btn rounded-lg">
          <i className="fa-solid fa-pen-to-square"></i>
          Edit
        </button>
      }
    >
      <ModalHeader className="!text-[24px] text-center">
        Edit Information
      </ModalHeader>
      <Modal.Content scrolling>
        <Modal.Description>
          <div className="my-4">
            <Form className="flex items-start gap-8" onSubmit={handleSubmit}>
              <div className="w-full">
                <FormField error={!!errors.name}>
                  <label className="!text-[14px]">Name:</label>
                  <input
                    name="name"
                    placeholder={`${data.name || "Enter name of group"}`}
                    className="outline-none !text-[14px] resize-none input-text-group"
                    value={data.name}
                    onChange={handleInputChange}
                  />
                </FormField>

                <FormField error={!!errors.description}>
                  <label className="!text-[14px]">Description:</label>
                  <input
                    name="description"
                    placeholder={`${
                      data.description || "Enter description of group"
                    }`}
                    className="outline-none !text-[14px] resize-none input-text-group"
                    value={data.description}
                    onChange={handleInputChange}
                  />
                </FormField>

                <FormField error={!!errors.rules}>
                  <label className="!text-[14px]">Rules:</label>
                  <textarea
                    name="rules"
                    placeholder={`${data.rules || "Enter rules of group"}`}
                    className="outline-none !text-[14px] resize-none input-text-group"
                    value={data.rules}
                    onChange={handleInputChange}
                  />
                </FormField>
                <FormField className="flex justify-center">
                  <Button
                    className={`relative w-32 h-12 mx-auto ${
                      false ? "" : "!bg-[#591bc5] !text-white"
                    }`}
                    type="submit"
                  >
                    Submit
                  </Button>
                </FormField>
              </div>
            </Form>
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  currentGroup: state.groups.currentGroup,
  updating: state.groups.updating,
});

export default connect(mapStateToProps)(EditAboutGroupModal);
