<?php
/**
 * Shared GET/POST/PATCH/DELETE router for a single page_sections row.
 * Every api/admin/{section}.php file just calls this after checking auth.
 *
 * POST   {field, item}         -> append item to a list field
 * PATCH  {field, value}        -> replace a whole field (object/scalar)
 * PATCH  {field, value, index} -> replace one item of a list field
 * DELETE {field, index}        -> remove one item from a list field
 */
function handleSectionCrud(PDO $pdo, string $section): void
{
    $method = $_SERVER['REQUEST_METHOD'];
    $content = getSectionContent($pdo, $section);

    switch ($method) {
        case 'GET':
            jsonResponse($content);
            break;

        case 'POST':
            $body = getRequestBody();
            $field = $body['field'] ?? null;
            $item = $body['item'] ?? null;

            if (!is_string($field) || $item === null) {
                jsonResponse(['error' => "'field' and 'item' are required."], 400);
            }

            if (!array_key_exists($field, $content)) {
                jsonResponse(['error' => "Field '{$field}' not found."], 404);
            }

            if (!in_array($field, getArrayFields($content), true)) {
                jsonResponse(['error' => "Field '{$field}' does not support create — it is not a list."], 422);
            }

            $content[$field][] = sanitizeValue($item);
            saveSectionContent($pdo, $section, $content);
            jsonResponse(['message' => 'Created.', 'field' => $field, 'items' => $content[$field]], 201);
            break;

        case 'PATCH':
            $body = getRequestBody();
            $field = $body['field'] ?? null;
            $value = $body['value'] ?? null;
            $index = $body['index'] ?? null;

            if (!is_string($field) || !array_key_exists($field, $content)) {
                jsonResponse(['error' => "Field '{$field}' not found."], 404);
            }

            $sanitizedValue = sanitizeValue($value);

            if ($index !== null) {
                $arrayFields = getArrayFields($content);
                if (!in_array($field, $arrayFields, true) || !array_key_exists((int) $index, $content[$field])) {
                    jsonResponse(['error' => "Field '{$field}' has no item at index {$index}."], 422);
                }
                $content[$field][(int) $index] = $sanitizedValue;
                saveSectionContent($pdo, $section, $content);
                jsonResponse(['message' => 'Updated.', 'field' => $field, 'items' => $content[$field]]);
            } else {
                $content[$field] = $sanitizedValue;
                saveSectionContent($pdo, $section, $content);
                jsonResponse(['message' => 'Updated.', 'field' => $field, 'value' => $content[$field]]);
            }
            break;

        case 'DELETE':
            $body = getRequestBody();
            $field = $body['field'] ?? null;
            $index = $body['index'] ?? null;

            if (!is_string($field) || $index === null) {
                jsonResponse(['error' => "'field' and 'index' are required."], 400);
            }

            if (!in_array($field, getArrayFields($content), true) || !array_key_exists((int) $index, $content[$field])) {
                jsonResponse(['error' => "Field '{$field}' does not support delete, or index {$index} is out of range."], 422);
            }

            array_splice($content[$field], (int) $index, 1);
            saveSectionContent($pdo, $section, $content);
            jsonResponse(['message' => 'Deleted.', 'field' => $field, 'items' => $content[$field]]);
            break;

        default:
            jsonResponse(['error' => 'Method not allowed.'], 405);
    }
}
