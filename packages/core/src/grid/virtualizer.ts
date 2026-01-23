export function getVisibleRows(
    scrollTop: number,
    clientHeight: number,
    rowHeight: number,
    totalRows: number,
    overscan: number = 20
) {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const end = Math.min(totalRows, start + Math.ceil(clientHeight / rowHeight) + overscan * 2);
    return {
        start,
        end,
        paddingTop: start * rowHeight,
        height: totalRows * rowHeight
    };
}

export function getVisibleCols(
    scrollLeft: number,
    clientWidth: number,
    colWidths: number[],
    overscan: number = 2
) {
    let left = 0;
    let start = 0;
    let accumulated = 0;

    while (accumulated < scrollLeft && start < colWidths.length) {
        accumulated += colWidths[start];
        if (accumulated < scrollLeft) {
            left = accumulated;
            start++;
        }
    }

    start = Math.max(0, start - overscan);

    let right = accumulated;
    let end = start;
    while (right < scrollLeft + clientWidth && end < colWidths.length) {
        right += colWidths[end++];
    }

    end = Math.min(colWidths.length, end + overscan);

    return {
        start,
        end,
        paddingLeft: left
    };
}

export const virtualizer = {
    getVisibleRows,
    getVisibleCols
};
