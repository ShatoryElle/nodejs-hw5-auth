import mongoose from 'mongoose';
import Joi from 'joi';
import createHttpError from 'http-errors';
import * as contactsService from '../services/contacts.js';

const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(5).max(20).required(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(5).max(20).optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
}).min(1);

export const getAllContactsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const result = await contactsService.getAllContacts(userId, {
      page,
      limit: perPage,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    res.status(200).json({
      status: 200,
      message: "Contacts fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid contact ID format');
    }

    const contact = await contactsService.getContactById(id, userId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact fetched successfully',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const addContactController = async (req, res, next) => {
  try {
    const { error } = addContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const userId = req.user.id;
    const contact = await contactsService.createContact(req.body, userId);

    res.status(201).json({
      status: 201,
      message: 'Contact added successfully',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid contact ID format');
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const updatedContact = await contactsService.updateContact(id, userId, req.body);
    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

export const removeContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid contact ID format');
    }

    const deleted = await contactsService.removeContact(id, userId);
    if (!deleted) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
