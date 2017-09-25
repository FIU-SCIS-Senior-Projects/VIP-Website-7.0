package edu.fiu.vip_web.vip_r5_stories.common;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by josep on 5/29/17.
 */
public class ExcelDocument {
    XSSFWorkbook doc;

    public ExcelDocument(FileInputStream source) {
        try {
            doc = new XSSFWorkbook(source);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read the excel document.");
        }
    }

    public String getAt(int page, int row, int col) {
        XSSFCell cell = doc.getSheetAt(page).getRow(row).getCell(col);
        if (cell == null) {
            return "";
        }
        return cell.getRawValue();
    }

    public List<String> getRow(int page, int rowNum) {
        XSSFRow row = doc.getSheetAt(page).getRow(rowNum);
        List<String> values = new ArrayList<>();
        for (int i = 0; i < getColCount(page, rowNum); i++) {
            values.add(getAt(page, rowNum, i));
        }
        return values;
    }

    public int getRowCount(int page) {
        return doc.getSheetAt(page).getLastRowNum() + 1;
    }

    public int getColCount(int page, int row) {
        return doc.getSheetAt(page).getRow(row).getLastCellNum();
    }
}
