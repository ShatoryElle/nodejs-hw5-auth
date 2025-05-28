import Contact from '../db/models/contact.js';

export const getAllContacts = async (userId, { page, limit, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [contacts, total] = await Promise.all([
    Contact.find({ userId }).sort(sort).skip(skip).limit(limit),
    Contact.countDocuments({ userId }),
  ]);

  return {
    contacts,
    total,
    page,
    limit,
  };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContact = async (contactId, userId, updateData) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, runValidators: true }
  );
};

export const updateStatusContact = async (contactId, userId, favorite) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { favorite },
    { new: true, runValidators: true }
  );
};

export const removeContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
