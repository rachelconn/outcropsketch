import { LabelType } from "../labeling/labeling";

/**
 * Enum values that can be used as layers
 * For now this only consists of the label types, but tools that don't want to make labels
 * should use different ones.
 */

export enum NonLabelType {
    PENCIL = "pencil",
    COMMENT = "comment",
}

type Layer = LabelType | NonLabelType;

export default Layer;
