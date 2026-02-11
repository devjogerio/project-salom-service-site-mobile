import sqlite3
import json
import os

# Caminho do banco de dados
db_path = 'honda.db'
output_file = '../services_catalog.json'

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

try:
    if not os.path.exists(db_path):
        print(f"Erro: Banco de dados não encontrado em {db_path}")
        exit(1)

    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cursor = conn.cursor()

    # Verificar tabelas existentes
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tabelas encontradas: {[t['name'] for t in tables]}")

    # Tentar extrair da tabela services
    if any(t['name'] == 'services' for t in tables):
        cursor.execute("SELECT * FROM services")
        rows = cursor.fetchall()
        
        # Processar campos JSON se existirem (ex: gallery, details)
        for row in rows:
            if 'gallery' in row and isinstance(row['gallery'], str):
                try:
                    row['gallery'] = json.loads(row['gallery'])
                except:
                    pass
            if 'details' in row and isinstance(row['details'], str):
                try:
                    row['details'] = json.loads(row['details'])
                except:
                    pass
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(rows, f, indent=2, ensure_ascii=False)
        print(f"Dados extraídos com sucesso para {output_file}")
        print(f"Total de registros: {len(rows)}")
    else:
        print("Tabela 'services' não encontrada no banco de dados.")

    conn.close()

except Exception as e:
    print(f"Erro ao processar banco de dados: {e}")
