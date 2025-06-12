import Contact from '../db/models/contact.js';

export const getAllContacts = async (userId, { page, limit, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const contacts = await Contact.find({ userId }).sort(sort).skip(skip).limit(limit);

  return contacts;
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (contactData, userId) => {
  return Contact.create({ ...contactData, userId });
};

export const updateContact = async (contactId, userId, updateData) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, runValidators: true }
  );
};

export const removeContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
