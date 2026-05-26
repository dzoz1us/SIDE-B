import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getEnsembles } from "../../services/ensembles";
import { getBranches } from "../../services/branches";
import { PageTitle, Btn, FormInput, SelectInput } from "../../components/ui";
import { EnsembleShort, Branch } from "../../types";
import axios from 'axios';

export default function ManagerRecordForm() {
  const { params, navigate } = useApp();
  const isEdit = params.mode === "edit";
  const [ensembles, setEnsembles] = useState<EnsembleShort[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [title, setTitle] = useState("");
  const [ensembleId, setEnsembleId] = useState("");
  const [catalogueNumber, setCatalogueNumber] = useState("");
  const [label, setLabel] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [branchId, setBranchId] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    getEnsembles().then(data => {
      setEnsembles(data);
      if (data.length > 0) setEnsembleId(String(data[0].id));
    });
    getBranches().then(data => {
      setBranches(data);
      if (data.length > 0) setBranchId(String(data[0].id));
    });
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!ensembleId || ensembleId === "0") {
      alert("Выберите ансамбль");
      return;
    }
    if (!branchId || branchId === "0") {
      alert("Выберите филиал");
      return;
    }

    const token = localStorage.getItem('access_token');
    const url = 'http://127.0.0.1:8000/api/v1/records/';

    if (coverImage) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('ensemble', ensembleId);
      formData.append('catalogue_number', catalogueNumber);
      formData.append('label', label);
      formData.append('supplier_address', supplierAddress);
      formData.append('release_date', releaseDate);
      formData.append('wholesale_price', wholesalePrice);
      formData.append('retail_price', retailPrice);
      formData.append('stock_quantity', stockQuantity);
      formData.append('branch', branchId);
      formData.append('cover_image', coverImage);

      try {
        await axios.post(url, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate("manager-records");
      } catch (err: any) {
        console.error('Ошибка:', err);
        alert(JSON.stringify(err.response?.data));
      }
    } else {
      const data = {
        title,
        ensemble: Number(ensembleId),
        catalogue_number: catalogueNumber,
        label,
        supplier_address: supplierAddress,
        release_date: releaseDate,
        wholesale_price: Number(wholesalePrice),
        retail_price: Number(retailPrice),
        stock_quantity: Number(stockQuantity),
        branch: Number(branchId),
      };

      try {
        await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        navigate("manager-records");
      } catch (err: any) {
        console.error('Ошибка:', err);
        alert(JSON.stringify(err.response?.data));
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
      <PageTitle title={isEdit ? "Редактировать пластинку" : "Добавить пластинку"} />
      <div className="bg-card border border-border p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Название" value={title} onChange={setTitle} placeholder="Название альбома" required className="md:col-span-2" />
            <SelectInput label="Ансамбль" value={ensembleId} onChange={setEnsembleId}
              options={ensembles.map(e => ({ value: String(e.id), label: e.name }))} />
            <FormInput label="Каталожный номер" value={catalogueNumber} onChange={setCatalogueNumber} placeholder="C10-12345" required />
            <FormInput label="Лейбл" value={label} onChange={setLabel} placeholder="Мелодия" required />
            <FormInput label="Адрес поставщика" value={supplierAddress} onChange={setSupplierAddress} placeholder="ООО «Поставщик»" className="md:col-span-2" />
            <FormInput label="Дата выпуска" type="date" value={releaseDate} onChange={setReleaseDate} required />
            <FormInput label="Оптовая цена (₽)" type="number" value={wholesalePrice} onChange={setWholesalePrice} placeholder="1200" required />
            <FormInput label="Розничная цена (₽)" type="number" value={retailPrice} onChange={setRetailPrice} placeholder="2400" required />
            <SelectInput label="Филиал" value={branchId} onChange={setBranchId}
              options={branches.map(b => ({ value: String(b.id), label: b.name }))} />
            <FormInput label="Кол-во на складе" type="number" value={stockQuantity} onChange={setStockQuantity} placeholder="0" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
              Обложка пластинки
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:bg-primary file:text-primary-foreground file:border-0 file:text-xs hover:file:bg-primary/80 transition-colors"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Предпросмотр" className="w-32 h-32 object-cover border border-border" />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-border">
            <Btn variant="ghost" onClick={() => navigate("manager-records")}>Отмена</Btn>
            <Btn type="submit" variant="primary">Сохранить</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}