import Contact from '../db/models/contact.js';

export const getAllContacts = async (userId) => {
  return await Contact.find({ userId });
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  return await newContact.save();
};

export const patchContact = async (contactId, userId, updateData) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, runValidators: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
