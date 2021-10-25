import { LabelType } from "../labeling/labeling";

/**
 * Enum values that can be used as layers
 * For now this only consists of the label types, but tools that don't want to make labels
 * should use different ones.
 */

export enum NonLabelType {
    PENCIL = "pencil",
    COMMENT = "comment",
    TOOL = "tool",
    UNLABELED_AREA = "unlabeled area",
}

// Name for the area that's unlabeled, accessed by paper.project.layers[NonLabelType.UNLABELED_AREA][UNLABELED_AREA_PATH_NAME]
export const UNLABELED_AREA_PATH_NAME = 'UNLABELED';

type Layer = LabelType | NonLabelType;

export default Layer;
