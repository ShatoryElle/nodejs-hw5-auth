import Contact from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async (userId, { page, limit, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [contacts, totalItems] = await Promise.all([
    Contact.find({ userId }).sort(sort).skip(skip).limit(limit),
    Contact.countDocuments({ userId }),
  ]);

  const pagination = calculatePaginationData(totalItems, limit, page);

  return {

    data: contacts, // масив контактів під ключем `data`
    page: pagination.page,
    perPage: pagination.perPage,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
  };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
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
