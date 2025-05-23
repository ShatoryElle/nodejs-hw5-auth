import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const userId = req.user.id;

  const result = await getAllContacts(userId, {
    page: Number(page),
    limit: Number(limit),
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 'success',
    message: 'Contacts fetched successfully',
    data: {
      contacts: result.contacts,
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    message: 'Contact found',
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      400,
      'Missing required fields: name, phoneNumber, or contactType',
    );
  }

  const newContact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Contact created successfully',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await patchContact(contactId, req.user.id, req.body);

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    message: 'Contact updated successfully',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId, req.user.id);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 'success',
    message: 'Contact deleted successfully',
    data: null,
  });
};
