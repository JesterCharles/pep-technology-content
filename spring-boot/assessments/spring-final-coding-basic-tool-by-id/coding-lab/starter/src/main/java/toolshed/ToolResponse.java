package toolshed;

/**
 * Provided and complete: the only shape clients ever see. It has exactly
 * id, assetTag, name, category and replacementCost, never purchaseNote.
 */
public record ToolResponse(Long id, String assetTag, String name, String category, int replacementCost) {

    public static ToolResponse from(Tool tool) {
        return new ToolResponse(tool.getId(), tool.getAssetTag(), tool.getName(), tool.getCategory(),
                tool.getReplacementCost());
    }
}
