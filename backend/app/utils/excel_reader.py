import pandas as pd


class ExcelReader:

    @staticmethod
    def read(file):

        df = pd.read_excel(file)

        return df