import pandas as pd

# Input file paths
first_year_file = r"C:\Users\asiva\Downloads\1st year Payment Pending list.csv"
all_years_file = r"C:\Users\asiva\Downloads\RoomBooking-2025-08-29 (2).csv"

# Output file path
output_file = "2_3_4_years_payment-pending.csv"

# Read CSVs
df_first_year = pd.read_csv(first_year_file)
df_all_years = pd.read_csv(all_years_file)

# Match using email column
key_column = "user__email"

# Filter out students present in first-year list
df_filtered = df_all_years[~df_all_years[key_column].isin(df_first_year[key_column])]

# Save result to new CSV
df_filtered.to_csv(output_file, index=False)

print(f"Filtered CSV saved as {output_file}")
