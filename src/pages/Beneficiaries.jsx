import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Pencil, Trash2, UserCheck, Phone, MapPin, Flag } from "lucide-react";
import {
  fetchBeneficiaries,
  deleteBeneficiary,
  clearBeneficiariesError,
} from "@/store/slices/beneficiariesSlice";
import BeneficiaryFormModal from "@/components/modals/BeneficiaryFormModal";
import DataListPage from "@/components/DataListPage";
import { CardBody, Button } from "@/styles/components";
import {
  SearchBar,
  BenCard,
  BenRow,
  BenInfo,
  BenName,
  BenMeta,
  Actions,
  EmptyState,
  CountryFlag,
} from "./styles/recipientStyled";

export default function Beneficiaries() {
  const dispatch = useDispatch();
  const {
    items: beneficiaries,
    status,
    deleting,
  } = useSelector((state) => state.beneficiaries);
  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner";

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchBeneficiaries());
    return () => dispatch(clearBeneficiariesError());
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return beneficiaries;
    return beneficiaries.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        (b.country ?? "").toLowerCase().includes(q),
    );
  }, [beneficiaries, search]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);
  const openEdit = useCallback((b) => {
    setEditing(b);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
  }, []);

  const handleDelete = async (id) => {
    if (pendingDelete === id) {
      const result = await dispatch(deleteBeneficiary(id));
      if (deleteBeneficiary.fulfilled.match(result)) {
        toast.success("Beneficiary deleted");
      } else {
        toast.error(result.payload?.message ?? "Error deleting beneficiary");
      }
      setPendingDelete(null);
    } else {
      setPendingDelete(id);
      toast("Delete beneficiary?", {
        description: "Click the icon again to confirm.",
        action: { label: "Cancel", onClick: () => setPendingDelete(null) },
      });
    }
  };

  return (
    <>
      <DataListPage
        title="Gestión de Beneficiarios"
        subtitle={`${filtered.length} beneficiario${filtered.length !== 1 ? "s" : ""} registrado${filtered.length !== 1 ? "s" : ""}`}
        actionLabel="Nuevo Beneficiario"
        onAction={openCreate}
        searchPlaceholder="Buscar por nombre, teléfono o país…"
        searchValue={search}
        onSearchChange={setSearch}
        SearchBarComponent={SearchBar}
        loading={status === "loading"}
        loadingText="Cargando beneficiarios…"
        isEmpty={filtered.length === 0}
        EmptyStateComponent={EmptyState}
        emptyIcon={UserCheck}
        emptyIconSize={52}
        emptyTitle={search ? "Sin resultados" : "No hay beneficiarios"}
        emptyDescription={
          search
            ? "Intenta con otros términos de búsqueda."
            : "Agrega tu primer beneficiario para comenzar."
        }
        emptyActionLabel={!search ? "Nuevo Beneficiario" : undefined}
        onEmptyAction={openCreate}
      >
        {filtered.map((b) => (
          <BenCard key={b.id}>
            <CardBody>
              <BenRow>
                <BenInfo>
                  <BenName>{b.name}</BenName>
                  <BenMeta>
                    <span>
                      <Phone size={12} /> {b.phone}
                    </span>
                    <span>
                      <CountryFlag>
                        <Flag size={12} /> {b.country}
                      </CountryFlag>
                    </span>
                    {b.notes && (
                      <span>
                        <MapPin size={12} /> {b.notes}
                      </span>
                    )}
                  </BenMeta>
                </BenInfo>
                <Actions>
                  <Button
                    $variant="ghost"
                    $size="sm"
                    onClick={() => openEdit(b)}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Button>
                  {isOwner && (
                    <Button
                      $variant={
                        pendingDelete === b.id ? "destructive" : "ghost"
                      }
                      $size="sm"
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting}
                      title={
                        pendingDelete === b.id ? "Confirm delete" : "Delete"
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </Actions>
              </BenRow>
            </CardBody>
          </BenCard>
        ))}
      </DataListPage>

      <BeneficiaryFormModal
        open={modalOpen}
        editing={editing}
        onClose={closeModal}
      />
    </>
  );
}
