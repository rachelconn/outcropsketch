from pathlib import Path

input_directory = Path(__file__).resolve().parent.parent / 'converted'
label_folder = input_directory / 'StructureTypeLabels'
validation_image_names = set([
    '100',
    '104',
    '108',
    '13',
    '15',
    '25',
    '33',
    '4',
    '49',
    '50',
    '53',
    '74',
    '85',
    '96',
    'DSC_0989_EW',
    'IMGP0424_EW',
    'IMGP1287_EW',
    'IMG_0597_EW',
])

# Create training datalists
with open(input_directory / 'train.txt', 'w') as train_datalist, open(input_directory / 'trainaug.txt', 'w') as trainaug_datalist:
    for label_file_path in label_folder.iterdir():
        name = label_file_path.stem
        if name not in validation_image_names:
            train_datalist.write(f'{name}\n')
            trainaug_datalist.write(f'{name}\n')

# Create validation datalists
with open(input_directory / 'trainval.txt', 'w') as trainval_datalist, open(input_directory / 'val.txt', 'w') as val_datalist:
    for name in validation_image_names:
        trainval_datalist.write(f'{name}\n')
        val_datalist.write(f'{name}\n')
