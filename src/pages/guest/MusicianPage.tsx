import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Badge } from "../../components/ui";

export default function MusicianPage() {
  const { params, navigate } = useApp();
  // Musician API пока нет полного эндпоинта, используем упрощённую версию
  // Данные приходят из ensembles/members, но отдельной страницы пока нет
  // Оставим заглушку с сообщением

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">
      <p>Страница музыканта находится в разработке</p>
      <button onClick={() => navigate("ensembles")} className="text-primary hover:underline mt-4 block mx-auto">
        Вернуться к ансамблям
      </button>
    </div>
  );
}