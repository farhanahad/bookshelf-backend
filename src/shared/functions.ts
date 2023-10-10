import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { promisify } from 'util';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import config from '../config';

const writeFileAsync = promisify(fs.writeFile);

export const isBase64Image = (str: string) => {
  const regex = /^data:(image|text)\/(jpeg|jpg|png|gif|html);base64,/;
  return regex.test(str);
};

export const saveBase64Image = async (base64Image: string): Promise<string> => {
  try {
    // Decode base64 image data
    const decodedImage = Buffer.from(base64Image, 'base64');

    // Generate a unique filename using UUID
    const filename = `${uuidv4()}.png`;

    // Define the path to save the image
    const imagePath = path.join(__dirname, '../images', filename);

    await writeFileAsync(imagePath, decodedImage); // Use await here

    // Create a URL pointing to the saved image
    const imageUrl = `http://localhost:${config.port}/images/${filename}`;

    return imageUrl;
  } catch (error) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'Failed to save the image❗'
    );
  }
};
