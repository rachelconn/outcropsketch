import os
import numpy as np
from PIL import Image
""" Converts CSV image labels to .png files """


if __name__ == '__main__':
    base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'converted')
    input_folder = os.path.join(base_path, 'y')
    structure_output_folder = os.path.join(base_path, 'StructureTypeLabels')
    surface_output_folder = os.path.join(base_path, 'SurfaceTypeLabels')
    os.makedirs(structure_output_folder, exist_ok=True)
    os.makedirs(surface_output_folder, exist_ok=True)

    for csv_filename in os.listdir(input_folder):
        filepath = os.path.join(input_folder, csv_filename)
        print(f'Converting {filepath}...')
        with open(filepath) as f:
            resolution, image_filename, mask = f.readlines()

            png_name = f'{os.path.splitext(image_filename[:-1])[0]}.png'
            structure_filename = os.path.join(structure_output_folder, png_name)
            surface_filename = os.path.join(surface_output_folder, png_name)

            width, height = (int(x) for x in resolution.split(','))

            mask = np.array(mask.split(','), dtype=np.uint8).reshape(height, width, 2)
            structure_mask = mask[:, :, 0]
            structure_mask[(structure_mask >= 129) & (structure_mask < 255)] = 8 # Merge all nongeological labels

            structure_mask[structure_mask == 0] = 255 # Mark pixels without a label as unknown
            structure_mask[structure_mask == 2] = 255 # Mark covered as unknown
            structure_mask[(structure_mask > 2) & (structure_mask < 15)] -= 1 # Decrement structure types greater than 2 to account for removal of covered (2)
            structure_mask[structure_mask < 15] -= 1 # Decrement all structure types again to account for removal of unknown (0)

            surface_mask = mask[:, :, 1]

            Image.fromarray(structure_mask, mode='L').save(structure_filename)
            Image.fromarray(surface_mask, mode='L').save(surface_filename)


    print('All files converted, exiting.')
