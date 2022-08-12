import paper from 'paper-jsdom-canvas';

/**
 * Return type of paper.exportJSON({ asString: false }).
 * An array of [ItemType string, Item attributes].
 */
export type ExportedProject = [string, Partial<paper.Item>][];
